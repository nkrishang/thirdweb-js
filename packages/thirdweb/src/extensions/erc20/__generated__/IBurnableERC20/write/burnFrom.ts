import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "burnFrom" function.
 */
export type BurnFromParams = WithOverrides<{
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
}>;

export const FN_SELECTOR = "0x79cc6790" as const;
const FN_INPUTS = [
  {
    name: "account",
    type: "address",
  },
  {
    name: "amount",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `burnFrom` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `burnFrom` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isBurnFromSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = isBurnFromSupported(["0x..."]);
 * ```
 */
export function isBurnFromSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "burnFrom" function.
 * @param options - The options for the burnFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeBurnFromParams } from "thirdweb/extensions/erc20";
 * const result = encodeBurnFromParams({
 *  account: ...,
 *  amount: ...,
 * });
 * ```
 */
export function encodeBurnFromParams(options: BurnFromParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account, options.amount]);
}

/**
 * Encodes the "burnFrom" function into a Hex string with its parameters.
 * @param options - The options for the burnFrom function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeBurnFrom } from "thirdweb/extensions/erc20";
 * const result = encodeBurnFrom({
 *  account: ...,
 *  amount: ...,
 * });
 * ```
 */
export function encodeBurnFrom(options: BurnFromParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBurnFromParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "burnFrom" function on the contract.
 * @param options - The options for the "burnFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { burnFrom } from "thirdweb/extensions/erc20";
 *
 * const transaction = burnFrom({
 *  contract,
 *  account: ...,
 *  amount: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function burnFrom(
  options: BaseTransactionOptions<
    | BurnFromParams
    | {
        asyncParams: () => Promise<BurnFromParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.account, resolvedOptions.amount] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
