import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintWithSignatureERC721" function.
 */
export type EncodeBytesBeforeMintWithSignatureERC721Params = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "uint48"; name: "startTimestamp" },
      { type: "uint48"; name: "endTimestamp" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
};

export const FN_SELECTOR = "0xcab11f42" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "startTimestamp",
        type: "uint48",
      },
      {
        name: "endTimestamp",
        type: "uint48",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
      },
      {
        name: "uid",
        type: "bytes32",
      },
    ],
    name: "params",
    type: "tuple",
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesBeforeMintWithSignatureERC721" function.
 * @param options - The options for the encodeBytesBeforeMintWithSignatureERC721 function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintWithSignatureERC721Params } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesBeforeMintWithSignatureERC721Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeBytesBeforeMintWithSignatureERC721Params(
  options: EncodeBytesBeforeMintWithSignatureERC721Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}
