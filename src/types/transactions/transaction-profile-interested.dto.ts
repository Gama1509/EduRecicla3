import { Product } from "../product-details.dto";
import { TransactionsProfileDto } from "./transactions-profile.dto";

export interface TransactionProfileInterestedDto extends TransactionsProfileDto {
    producto: Product;
}