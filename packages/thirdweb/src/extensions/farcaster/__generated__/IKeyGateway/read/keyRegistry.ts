import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x086b5198" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `keyRegistry` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `keyRegistry` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isKeyRegistrySupported } from "thirdweb/extensions/farcaster";
 * const supported = isKeyRegistrySupported(["0x..."]);
 * ```
 */
export function isKeyRegistrySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the keyRegistry function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeyRegistryResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeyRegistryResultResult("...");
 * ```
 */
export function decodeKeyRegistryResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "keyRegistry" function on the contract.
 * @param options - The options for the keyRegistry function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { keyRegistry } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyRegistry({
 *  contract,
 * });
 *
 * ```
 */
export async function keyRegistry(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
