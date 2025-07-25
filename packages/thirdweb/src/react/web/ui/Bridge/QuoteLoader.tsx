"use client";
import { useEffect } from "react";
import type { Token } from "../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { toUnits } from "../../../../utils/units.js";
import {
  type BridgePrepareRequest,
  type BridgePrepareResult,
  type UseBridgePrepareParams,
  useBridgePrepare,
} from "../../../core/hooks/useBridgePrepare.js";
import type { PaymentMethod } from "../../../core/machines/paymentMachine.js";
import { Container } from "../components/basic.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Text } from "../components/text.js";

interface QuoteLoaderProps {
  /**
   * The destination token to bridge to
   */
  destinationToken: Token;

  /**
   * The payment method to use
   */
  paymentMethod: PaymentMethod;

  /**
   * The amount to bridge (as string)
   */
  amount: string;

  /**
   * The sender address
   */
  sender?: string;

  /**
   * The receiver address (defaults to sender for fund_wallet mode)
   */
  receiver: string;

  /**
   * ThirdwebClient for API calls
   */
  client: ThirdwebClient;

  /**
   * Called when a quote is successfully received
   */
  onQuoteReceived: (
    preparedQuote: BridgePrepareResult,
    request: BridgePrepareRequest,
  ) => void;

  /**
   * Called when an error occurs
   */
  onError: (error: Error) => void;

  /**
   * Called when user wants to go back
   */
  onBack?: () => void;

  /**
   * Optional purchase data for the payment
   */
  purchaseData?: object;

  /**
   * Optional payment link ID for the payment
   */
  paymentLinkId?: string;

  /**
   * Fee payer for direct transfers (defaults to sender)
   */
  feePayer?: "sender" | "receiver";
}

export function QuoteLoader({
  destinationToken,
  paymentMethod,
  amount,
  sender,
  receiver,
  client,
  onQuoteReceived,
  onError,
  purchaseData,
  paymentLinkId,
  feePayer,
}: QuoteLoaderProps) {
  // For now, we'll use a simple buy operation
  // This will be expanded to handle different bridge types based on the payment method
  const request: BridgePrepareRequest = getBridgeParams({
    amount,
    client,
    destinationToken,
    feePayer,
    paymentLinkId,
    paymentMethod,
    purchaseData,
    receiver,
    sender,
  });
  const prepareQuery = useBridgePrepare(request);

  // Handle successful quote
  useEffect(() => {
    if (prepareQuery.data) {
      onQuoteReceived(prepareQuery.data, request);
    }
  }, [prepareQuery.data, onQuoteReceived, request]);

  // Handle errors
  useEffect(() => {
    if (prepareQuery.error) {
      onError(prepareQuery.error as Error);
    }
  }, [prepareQuery.error, onError]);

  return (
    <Container
      center="both"
      flex="column"
      fullHeight
      p="lg"
      style={{ minHeight: "350px" }}
    >
      <Spinner color="secondaryText" size="xl" />
      <Spacer y="md" />
      <Text center color="primaryText" size="lg" style={{ fontWeight: 600 }}>
        Finding the best route...
      </Text>
      <Spacer y="sm" />
      <Text center color="secondaryText" size="sm">
        We're searching for the most efficient path for this payment.
      </Text>
    </Container>
  );
}

function getBridgeParams(args: {
  paymentMethod: PaymentMethod;
  amount: string;
  destinationToken: Token;
  receiver: string;
  client: ThirdwebClient;
  sender?: string;
  feePayer?: "sender" | "receiver";
  purchaseData?: object;
  paymentLinkId?: string;
}): UseBridgePrepareParams {
  const { paymentMethod, amount, destinationToken, receiver, client, sender } =
    args;

  switch (paymentMethod.type) {
    case "fiat":
      return {
        amount: toUnits(amount, destinationToken.decimals),
        chainId: destinationToken.chainId,
        client,
        currency: paymentMethod.currency,
        enabled: !!(destinationToken && amount && client),
        onramp: paymentMethod.onramp || "coinbase",
        onrampTokenAddress: NATIVE_TOKEN_ADDRESS,
        paymentLinkId: args.paymentLinkId,
        purchaseData: args.purchaseData,
        receiver,
        sender, // always onramp to native token
        tokenAddress: destinationToken.address,
        type: "onramp",
      };
    case "wallet":
      // if the origin token is the same as the destination token, use transfer type
      if (
        paymentMethod.originToken.chainId === destinationToken.chainId &&
        paymentMethod.originToken.address.toLowerCase() ===
          destinationToken.address.toLowerCase()
      ) {
        return {
          amount: toUnits(amount, destinationToken.decimals),
          chainId: destinationToken.chainId,
          client,
          enabled: !!(destinationToken && amount && client),
          feePayer: args.feePayer || "sender",
          paymentLinkId: args.paymentLinkId,
          purchaseData: args.purchaseData,
          receiver,
          sender:
            sender ||
            paymentMethod.payerWallet.getAccount()?.address ||
            receiver,
          tokenAddress: destinationToken.address,
          type: "transfer",
        };
      }

      return {
        amount: toUnits(amount, destinationToken.decimals),
        client,
        destinationChainId: destinationToken.chainId,
        destinationTokenAddress: destinationToken.address,
        enabled: !!(destinationToken && amount && client),
        originChainId: paymentMethod.originToken.chainId,
        originTokenAddress: paymentMethod.originToken.address,
        paymentLinkId: args.paymentLinkId,
        purchaseData: args.purchaseData,
        receiver,
        sender:
          sender || paymentMethod.payerWallet.getAccount()?.address || receiver,
        type: "buy",
      };
  }
}
