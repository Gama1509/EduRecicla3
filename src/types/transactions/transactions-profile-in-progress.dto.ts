import { TransactionsProfileDto } from "./transactions-profile.dto";

export interface TransactionsProfileInProgressDto extends TransactionsProfileDto {
    chatId: string
}