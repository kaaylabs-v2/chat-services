import { Schema, model, Document } from 'mongoose';

export interface Message extends Document {
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  readBy: string[];
  attachmentUrl: string;
}

const MessageSchema = new Schema<Message>({
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  readBy: { type: [String], required: true },
  attachmentUrl: { type: String, required: true },
});

export const MessageModel = model<Message>('Message', MessageSchema);
