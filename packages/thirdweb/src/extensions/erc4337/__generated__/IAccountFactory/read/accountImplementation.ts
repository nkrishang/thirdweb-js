import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x11464fbe" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `accountImplementation` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `accountImplementation` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAccountImplementationSupported } from "thirdweb/extensions/erc4337";
 * const supported = isAccountImplementationSupported(["0x..."]);
 * ```
 */
export function isAccountImplementationSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the accountImplementation function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeAccountImplementationResult } from "thirdweb/extensions/erc4337";
 * const result = decodeAccountImplementationResultResult("...");
 * ```
 */
export function decodeAccountImplementationResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "accountImplementation" function on the contract.
 * @param options - The options for the accountImplementation function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { accountImplementation } from "thirdweb/extensions/erc4337";
 *
 * const result = await accountImplementation({
 *  contract,
 * });
 *
 * ```
 */
export async function accountImplementation(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
