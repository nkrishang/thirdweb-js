import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAllOffers" function.
 */
export type GetAllOffersParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

export const FN_SELECTOR = "0xc1edcfbe" as const;
const FN_INPUTS = [
  {
    name: "_startId",
    type: "uint256",
  },
  {
    name: "_endId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "offerId",
        type: "uint256",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "quantity",
        type: "uint256",
      },
      {
        name: "totalPrice",
        type: "uint256",
      },
      {
        name: "expirationTimestamp",
        type: "uint256",
      },
      {
        name: "offeror",
        type: "address",
      },
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "status",
        type: "uint8",
      },
    ],
    name: "offers",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getAllOffers` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllOffers` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetAllOffersSupported } from "thirdweb/extensions/marketplace";
 * const supported = isGetAllOffersSupported(["0x..."]);
 * ```
 */
export function isGetAllOffersSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAllOffers" function.
 * @param options - The options for the getAllOffers function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllOffersParams } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllOffersParams({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllOffersParams(options: GetAllOffersParams) {
  return encodeAbiParameters(FN_INPUTS, [options.startId, options.endId]);
}

/**
 * Encodes the "getAllOffers" function into a Hex string with its parameters.
 * @param options - The options for the getAllOffers function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllOffers } from "thirdweb/extensions/marketplace";
 * const result = encodeGetAllOffers({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllOffers(options: GetAllOffersParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAllOffersParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAllOffers function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAllOffersResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAllOffersResultResult("...");
 * ```
 */
export function decodeGetAllOffersResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllOffers" function on the contract.
 * @param options - The options for the getAllOffers function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAllOffers } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllOffers({
 *  contract,
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllOffers(
  options: BaseTransactionOptions<GetAllOffersParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.startId, options.endId],
  });
}
