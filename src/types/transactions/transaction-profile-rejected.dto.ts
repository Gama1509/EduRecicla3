import { TransactionsProfileDto } from "./transactions-profile.dto";

export interface TransactionProfileRejectedDto extends TransactionsProfileDto{
    rejectedReason: string;
}