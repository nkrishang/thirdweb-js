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
 * Represents the parameters for the "enableFeeAmount" function.
 */
export type EnableFeeAmountParams = WithOverrides<{
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  tickSpacing: AbiParameterToPrimitiveType<{
    type: "int24";
    name: "tickSpacing";
  }>;
}>;

export const FN_SELECTOR = "0x8a7c195f" as const;
const FN_INPUTS = [
  {
    name: "fee",
    type: "uint24",
  },
  {
    name: "tickSpacing",
    type: "int24",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `enableFeeAmount` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `enableFeeAmount` method is supported.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { isEnableFeeAmountSupported } from "thirdweb/extensions/uniswap";
 *
 * const supported = isEnableFeeAmountSupported(["0x..."]);
 * ```
 */
export function isEnableFeeAmountSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "enableFeeAmount" function.
 * @param options - The options for the enableFeeAmount function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeEnableFeeAmountParams } from "thirdweb/extensions/uniswap";
 * const result = encodeEnableFeeAmountParams({
 *  fee: ...,
 *  tickSpacing: ...,
 * });
 * ```
 */
export function encodeEnableFeeAmountParams(options: EnableFeeAmountParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fee, options.tickSpacing]);
}

/**
 * Encodes the "enableFeeAmount" function into a Hex string with its parameters.
 * @param options - The options for the enableFeeAmount function.
 * @returns The encoded hexadecimal string.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeEnableFeeAmount } from "thirdweb/extensions/uniswap";
 * const result = encodeEnableFeeAmount({
 *  fee: ...,
 *  tickSpacing: ...,
 * });
 * ```
 */
export function encodeEnableFeeAmount(options: EnableFeeAmountParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeEnableFeeAmountParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "enableFeeAmount" function on the contract.
 * @param options - The options for the "enableFeeAmount" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { enableFeeAmount } from "thirdweb/extensions/uniswap";
 *
 * const transaction = enableFeeAmount({
 *  contract,
 *  fee: ...,
 *  tickSpacing: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function enableFeeAmount(
  options: BaseTransactionOptions<
    | EnableFeeAmountParams
    | {
        asyncParams: () => Promise<EnableFeeAmountParams>;
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
      return [resolvedOptions.fee, resolvedOptions.tickSpacing] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
