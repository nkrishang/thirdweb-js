import { getNFT as getNFTInsight } from "../../../insight/get-nfts.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { fetchTokenMetadata } from "../../../utils/nft/fetchTokenMetadata.js";
import { type NFT, parseNFT } from "../../../utils/nft/parseNft.js";
import { totalSupply } from "../__generated__/IERC1155/read/totalSupply.js";
import { uri } from "../__generated__/IERC1155/read/uri.js";

export { isUriSupported as isGetNFTSupported } from "../__generated__/IERC1155/read/uri.js";

/**
 * Parameters for getting an NFT.
 * @extension ERC1155
 */
export type GetNFTParams = {
  tokenId: bigint;
  /**
   * Whether to use the insight API to fetch the NFT.
   * @default true
   */
  useIndexer?: boolean;
};

/**
 * Retrieves information about a specific ERC1155 non-fungible token (NFT).
 * @param options - The options for retrieving the NFT.
 * @returns A promise that resolves to the NFT object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getNFT } from "thirdweb/extensions/erc1155";
 * const nft = await getNFT({
 *  contract,
 *  tokenId: 1n,
 * });
 * ```
 */
export async function getNFT(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT> {
  const { useIndexer = true } = options;
  if (useIndexer) {
    try {
      return await getNFTFromInsight(options);
    } catch {
      return await getNFTFromRPC(options);
    }
  }
  return await getNFTFromRPC(options);
}

async function getNFTFromInsight(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT> {
  const nft = await getNFTInsight({
    chain: options.contract.chain,
    client: options.contract.client,
    contractAddress: options.contract.address,
    tokenId: options.tokenId,
  });
  if (!nft) {
    // fresh contracts might be delayed in indexing, so we fallback to RPC
    return getNFTFromRPC(options);
  }
  return nft;
}

async function getNFTFromRPC(
  options: BaseTransactionOptions<GetNFTParams>,
): Promise<NFT> {
  const [tokenUri, supply] = await Promise.all([
    uri({
      contract: options.contract,
      tokenId: options.tokenId,
    }),
    totalSupply({
      contract: options.contract,
      id: options.tokenId,
      // in cases where the supply is not available -> fall back to 0
    }).catch(() => 0n),
  ]);
  return parseNFT(
    await fetchTokenMetadata({
      client: options.contract.client,
      tokenId: options.tokenId,
      tokenUri,
    }).catch(() => ({
      id: options.tokenId,
      type: "ERC1155",
      uri: tokenUri,
    })),
    {
      chainId: options.contract.chain.id,
      owner: null,
      supply,
      tokenAddress: options.contract.address,
      tokenId: options.tokenId,
      tokenUri,
      type: "ERC1155",
    },
  );
}
