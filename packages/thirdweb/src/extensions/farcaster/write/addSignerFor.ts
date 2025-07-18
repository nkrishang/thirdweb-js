import type { Address } from "abitype";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { toBigInt } from "../../../utils/bigint.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { nonces } from "../__generated__/IKeyGateway/read/nonces.js";
import { getKeyGateway } from "../contracts/getKeyGateway.js";
import { getFid } from "../read/getFid.js";

/**
 * Represents the parameters for the `addSignerFor` function.
 *
 * This function can be used wither be provided pre-generated signatures or the wallet accounts directly.
 * This is done so the helpers can be used when there's no direct access to the account, but signatures can be generated (e.g. engine)
 *
 * If the `userAccount` is not provided, the `addSignature`, `userAddress`, and `deadline` must be provided.
 * If the `appAccount` is not provided, the `signedKeyRequestMetadata`, `appAccountAddress` and `deadline` must be provided.
 * `deadline` must match the one used to generate the signatures.
 *
 * @extension FARCASTER
 */
export type AddSignerForParams = Prettify<
  {
    client: ThirdwebClient;
    signerPublicKey: Hex;
    chain?: Chain;
    disableCache?: boolean;
  } & (
    | {
        appAccount: Account;
      }
    | {
        signedKeyRequestMetadata: Hex;
        appAccountAddress: Address;
        deadline: bigint;
      }
  ) &
    (
      | {
          userAccount: Account;
        }
      | {
          addSignature: Hex;
          userAddress: Address;
          deadline: bigint;
        }
    )
>;

/**
 * Adds farcaster signer for a given user. Helpful if you want to cover the gas fee for a user.
 * @param options - The options for adding the signer.
 * @returns A prepared transaction object to add the signer to the account.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { addSignerFor } from "thirdweb/extensions/farcaster";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = addSignerFor({
 *  client,
 * 	appAccount,
 * 	userAccount,
 *  signerPublicKey
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function addSignerFor(options: AddSignerForParams) {
  const keyGateway = getKeyGateway({
    chain: options.chain,
    client: options.client,
  });
  return prepareContractCall({
    contract: keyGateway,
    method: [
      "0xa005d3d2",
      [
        {
          name: "fidOwner",
          type: "address",
        },
        {
          name: "keyType",
          type: "uint32",
        },
        {
          name: "key",
          type: "bytes",
        },
        {
          name: "metadataType",
          type: "uint8",
        },
        {
          name: "metadata",
          type: "bytes",
        },
        {
          name: "deadline",
          type: "uint256",
        },
        {
          name: "sig",
          type: "bytes",
        },
      ],
      [],
    ],
    params: async () => {
      const deadline =
        "deadline" in options
          ? options.deadline
          : BigInt(Math.floor(Date.now() / 1000) + 3600); // default signatures last for 1 hour

      const appAccountAddress =
        "appAccount" in options
          ? options.appAccount.address
          : options.appAccountAddress;
      const userAddress =
        "userAccount" in options
          ? options.userAccount.address
          : options.userAddress;

      // Fetch the app's FID
      const appFid = await getFid({
        address: appAccountAddress,
        chain: options.chain,
        client: options.client,
        disableCache: options.disableCache,
      });
      if (appFid === 0n) {
        throw new Error(`No fid found for app account: ${appAccountAddress}`);
      }

      // Set the signedKeyRequestMetadata if provided, otherwise generate using the app account
      let signedKeyRequestMetadata: Hex;
      if ("signedKeyRequestMetadata" in options) {
        signedKeyRequestMetadata = options.signedKeyRequestMetadata;
      } else if ("appAccount" in options) {
        const { getSignedKeyRequestMetadata } = await import(
          "../eip712Signatures/keyRequestSignature.js"
        );
        signedKeyRequestMetadata = await getSignedKeyRequestMetadata({
          account: options.appAccount,
          message: {
            deadline,
            key: options.signerPublicKey,
            requestFid: toBigInt(appFid),
          },
        });
      } else {
        throw new Error(
          "Invalid options, expected signedKeyRequestMetadata or appAccount to be provided",
        );
      }

      // Fetch the user's current key gateway nonce
      const nonce = await nonces({
        account: userAddress,
        contract: keyGateway,
      });

      // Set the addSignature if provided, otherwise generate one using the user account
      let addSignature: Hex;
      if ("addSignature" in options) {
        addSignature = options.addSignature;
      } else if ("userAccount" in options) {
        const { signAdd } = await import("../eip712Signatures/addSignature.js");
        addSignature = await signAdd({
          account: options.userAccount,
          message: {
            deadline,
            key: options.signerPublicKey,
            keyType: 1,
            metadata: signedKeyRequestMetadata,
            metadataType: 1,
            nonce,
            owner: userAddress,
          },
        });
      } else {
        throw new Error(
          "Invalid options, expected addSignature or userAccount to be provided",
        );
      }

      return [
        userAddress,
        1,
        options.signerPublicKey,
        1,
        signedKeyRequestMetadata,
        deadline,
        addSignature,
      ] as const;
    },
  });
}
