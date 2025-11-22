export enum MessageType { TEXT = 'TEXT', IMAGE = 'IMAGE', TEXT_WITH_IMAGE = 'TEXT_WITH_IMAGE', }
export interface ChatMessageDto {
  id: string;
  type: MessageType;
  chatId: string;
  senderId: string;
  text?: string;
  createdAt: string;
  read: boolean;
  images?: string[];
  readAt?: string;
}