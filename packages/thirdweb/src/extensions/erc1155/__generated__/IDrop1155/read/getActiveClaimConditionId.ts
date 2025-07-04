import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getActiveClaimConditionId" function.
 */
export type GetActiveClaimConditionIdParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

export const FN_SELECTOR = "0x5ab063e8" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getActiveClaimConditionId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getActiveClaimConditionId` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isGetActiveClaimConditionIdSupported } from "thirdweb/extensions/erc1155";
 * const supported = isGetActiveClaimConditionIdSupported(["0x..."]);
 * ```
 */
export function isGetActiveClaimConditionIdSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getActiveClaimConditionId" function.
 * @param options - The options for the getActiveClaimConditionId function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeGetActiveClaimConditionIdParams } from "thirdweb/extensions/erc1155";
 * const result = encodeGetActiveClaimConditionIdParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetActiveClaimConditionIdParams(
  options: GetActiveClaimConditionIdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getActiveClaimConditionId" function into a Hex string with its parameters.
 * @param options - The options for the getActiveClaimConditionId function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeGetActiveClaimConditionId } from "thirdweb/extensions/erc1155";
 * const result = encodeGetActiveClaimConditionId({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetActiveClaimConditionId(
  options: GetActiveClaimConditionIdParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetActiveClaimConditionIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getActiveClaimConditionId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeGetActiveClaimConditionIdResult } from "thirdweb/extensions/erc1155";
 * const result = decodeGetActiveClaimConditionIdResultResult("...");
 * ```
 */
export function decodeGetActiveClaimConditionIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getActiveClaimConditionId" function on the contract.
 * @param options - The options for the getActiveClaimConditionId function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getActiveClaimConditionId } from "thirdweb/extensions/erc1155";
 *
 * const result = await getActiveClaimConditionId({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions<GetActiveClaimConditionIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
