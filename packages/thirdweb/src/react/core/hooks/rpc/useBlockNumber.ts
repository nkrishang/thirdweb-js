import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_blockNumber } from "../../../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { watchBlockNumber } from "../../../../rpc/watchBlockNumber.js";

export type UseBlockNumberOptions = {
  client: ThirdwebClient;
  chain: Chain;
  enabled?: boolean;
  watch?: boolean;
};

/**
 * Hook that watches for changes in the block number on a given chain.
 * @param options - The options for the hook.
 * @returns The latest block number.
 * @example
 * ```ts
 * import { useBlockNumber } from "thirdweb/react";
 * const blockNumber = useBlockNumber({client, chain});
 * ```
 * @utils
 */
export function useBlockNumber(options: UseBlockNumberOptions) {
  const { client, chain, enabled = true, watch = true } = options;

  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [chain.id, "blockNumber"] as const, [chain]);
  const query = useQuery({
    enabled,
    queryFn: async () => {
      const rpcRequest = getRpcClient({ chain, client });
      return await eth_blockNumber(rpcRequest);
    },
    // TODO: technically client should be part of the queryKey here...

    queryKey: queryKey,
  });

  useEffect(() => {
    if (!enabled || !watch) {
      // don't watch if not enabled or not watching
      return;
    }
    return watchBlockNumber({
      chain,
      client,
      onNewBlockNumber: (newBlockNumber) => {
        queryClient.setQueryData(queryKey, newBlockNumber);
      },
    });
  }, [client, chain, enabled, queryClient, queryKey, watch]);

  return query.data;
}
