import { ProductInChatDto } from "../products/product-in-chat.dto";
import { UserSummary } from "../users/user-summary.dto";
import { ChatMessageDto } from "./chat-message.dto";

export interface ChatWithMessagesDto {
  id: string;
  transactionId: string;
  currentUser: UserSummary;
  otherUser: UserSummary;
  product: ProductInChatDto;
  canMarkAsDelivered: boolean;
  isActive: boolean;
  messages: ChatMessageDto[];
}