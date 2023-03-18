export interface Message {
  id: string | null;
  senderId: string | null;
  receiverId: string;
  content: string;
  timestamp: Date;
}
