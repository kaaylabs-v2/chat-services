import { Schema, model, Document } from 'mongoose';

export interface Conversation extends Document {
  name: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<Conversation>({
  name: { type: String, required: true },
  participants: { type: [String], required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const ConversationModel = model<Conversation>('Conversation', ConversationSchema);
