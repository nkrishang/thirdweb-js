import type { Address } from "abitype";
import { getContract } from "../../../../contract/contract.js";
import { isHex } from "../../../../utils/encoding/helpers/is-hex.js";
import { stringify } from "../../../../utils/json.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../../../prepare-transaction.js";
import { readContract } from "../../../read-contract.js";
import type { SerializableTransaction } from "../../../serialize-transaction.js";
import type { WaitForReceiptOptions } from "../../wait-for-tx-receipt.js";

/**
 * @transaction
 */
export type OpenZeppelinOptions = {
  provider: "openzeppelin";
  relayerUrl: string;
  relayerForwarderAddress: Address;
  domainName?: string; // default: "GSNv2 Forwarder"
  domainVersion?: string; // default: "0.0.1"
  domainSeparatorVersion?: string; // default: "1"
  experimentalChainlessSupport?: boolean; // default: false
};

type SendOpenZeppelinTransactionOptions = {
  account: Account;
  // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
  serializableTransaction: SerializableTransaction;
  gasless: OpenZeppelinOptions;
};

/**
 * @internal - only exported for testing
 */
export async function prepareOpenZeppelinTransaction({
  account,
  serializableTransaction,
  transaction,
  gasless,
}: SendOpenZeppelinTransactionOptions) {
  const forrwaderContract = getContract({
    address: gasless.relayerForwarderAddress,
    chain: transaction.chain,
    client: transaction.client,
  });

  const nonce = await readContract({
    contract: forrwaderContract,
    method: "function getNonce(address) view returns (uint256)",
    params: [account.address],
  });

  const [signature, message] = await (async () => {
    // TODO: handle special case for `approve` -> `permit` transactions

    if (!serializableTransaction.to) {
      throw new Error("OpenZeppelin transactions must have a 'to' address");
    }
    if (!serializableTransaction.gas) {
      throw new Error("OpenZeppelin transactions must have a 'gas' value");
    }
    if (!serializableTransaction.data) {
      throw new Error("OpenZeppelin transactions must have a 'data' value");
    }
    // chainless support!
    if (gasless.experimentalChainlessSupport) {
      const message = {
        chainid: BigInt(transaction.chain.id),
        data: serializableTransaction.data,
        from: account.address,
        gas: serializableTransaction.gas,
        nonce: nonce,
        to: serializableTransaction.to,
        value: 0n,
      } as const;
      return [
        await account.signTypedData({
          domain: {
            name: "GSNv2 Forwarder",
            verifyingContract: forrwaderContract.address,
            version: "0.0.1",
          },
          message,
          primaryType: "ForwardRequest",
          types: { ForwardRequest: ChainAwareForwardRequest },
        }),
        message,
      ] as const;
    }
    // else non-chainless support
    const message = {
      data: serializableTransaction.data,
      from: account.address,
      gas: serializableTransaction.gas,
      nonce: nonce,
      to: serializableTransaction.to,
      value: 0n,
    } as const;
    return [
      await account.signTypedData({
        domain: {
          chainId: transaction.chain.id,
          name: gasless.domainName ?? "GSNv2 Forwarder",
          verifyingContract: forrwaderContract.address,
          version: gasless.domainVersion ?? "0.0.1",
        },
        message,
        primaryType: "ForwardRequest",
        types: { ForwardRequest },
      }),
      message,
    ] as const;
  })();
  // TODO: handle special case for `approve` -> `permit`
  const messageType = "forward";

  return { message, messageType, signature } as const;
}

const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
] as const;

const ChainAwareForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
  { name: "chainid", type: "uint256" },
] as const;

/**
 * @internal
 */
export async function relayOpenZeppelinTransaction(
  options: SendOpenZeppelinTransactionOptions,
): Promise<WaitForReceiptOptions> {
  const { message, messageType, signature } =
    await prepareOpenZeppelinTransaction(options);

  const response = await fetch(options.gasless.relayerUrl, {
    body: stringify({
      forwarderAddress: options.gasless.relayerForwarderAddress,
      request: message,
      signature,
      type: messageType,
    }),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to send transaction: ${await response.text()}`);
  }
  const json = await response.json();
  if (!json.result) {
    throw new Error(`Relay transaction failed: ${json.message}`);
  }
  const transactionHash = JSON.parse(json.result).txHash;
  if (isHex(transactionHash)) {
    return {
      chain: options.transaction.chain,
      client: options.transaction.client,
      transactionHash,
    };
  }

  throw new Error(`Failed to send transaction: ${stringify(json)}`);
}
