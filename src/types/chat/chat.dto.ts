import { UserSummary } from "../users/user-summary.dto";
import { ChatMessageDto } from "./chat-message.dto";

export interface ChatDto {
  id: string;
  currentUser: UserSummary;
  otherUser: UserSummary;
  lastMessage?: ChatMessageDto; // opcional, puede ser null
  isActive: boolean;
  updatedAt: string;
}
