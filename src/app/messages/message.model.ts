export interface Message {
  id?: string | null;
  senderId: string | null;
  receiverId: string | null;
  content: string;
  timestamp?: Date;
}

export interface NewMessage {
  senderId: string | null;
  receiverId: string | null;
  content: string;
}
