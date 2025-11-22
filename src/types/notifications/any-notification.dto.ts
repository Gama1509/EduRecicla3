import { AvailableAnyNotification, AvailableFullNotification, BuyerCancelledTransactionNotification, BuyerWaitAnyNotification, BuyerWaitFullNotification, CompletionConfirmedBuyerNotification, CompletionConfirmedSellerNotification, DeliveryMarkedNotification, InterestAcceptedNotification, InterestCancelledNotification, InterestMarkedNotification, InterestRejectedNotification, ProductAcceptedNotification, ProductRejectedNotification, SellerCancelledTransactionNotification, SoldOutPartialNotification, SoldOutTotalNotification } from "./notification.dto";

export type AnyNotification =
  | ProductAcceptedNotification
  | ProductRejectedNotification
  | InterestMarkedNotification
  | InterestAcceptedNotification
  | InterestRejectedNotification
  | SellerCancelledTransactionNotification
  | BuyerCancelledTransactionNotification
  | DeliveryMarkedNotification
  | CompletionConfirmedBuyerNotification
  | CompletionConfirmedSellerNotification
  | InterestCancelledNotification
  | SoldOutTotalNotification
  | SoldOutPartialNotification
  | AvailableFullNotification
  | AvailableAnyNotification
  | BuyerWaitAnyNotification
  | BuyerWaitFullNotification
  ;
