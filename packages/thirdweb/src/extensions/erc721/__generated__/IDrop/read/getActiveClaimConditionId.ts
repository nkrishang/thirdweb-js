import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xc68907de" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getActiveClaimConditionId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getActiveClaimConditionId` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetActiveClaimConditionIdSupported } from "thirdweb/extensions/erc721";
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
 * Decodes the result of the getActiveClaimConditionId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetActiveClaimConditionIdResult } from "thirdweb/extensions/erc721";
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
 * @extension ERC721
 * @example
 * ```ts
 * import { getActiveClaimConditionId } from "thirdweb/extensions/erc721";
 *
 * const result = await getActiveClaimConditionId({
 *  contract,
 * });
 *
 * ```
 */
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
