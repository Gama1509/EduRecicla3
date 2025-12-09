import { DashboardTransactionsDto, TransactionStatus } from "../dashboard-transactions.dto"
import { NotificationType } from "../notifications/notification-type.enum"

export interface TransactionsProfileDto extends DashboardTransactionsDto {
    product_id: string
    product_image: string
    buyer_id: string
    buyer_image: string
    seller_image: string
    transaction_status: TransactionStatus
    last_notification_type_for_seller: NotificationType
    last_notification_type_for_buyer: NotificationType
    last_notification_type_for_transaction: NotificationType
}