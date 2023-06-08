import { Router, Request, Response } from 'express';
import { ConversationModel } from '../models/conversation';
import { Server as SocketIOServer } from 'socket.io';
import { randomUUID } from 'crypto';

const router: Router = Router();

const conversationRoutes = (io: SocketIOServer) => {
  // Create a new conversation
  router.post('/', (req: Request, res: Response) => {
    const { name, participants } = req.body;

    const conversation = new ConversationModel({
      name,
      participants,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    conversation.save()
      .then((savedConversation) => {
        console.log('Conversation created:', savedConversation._id);

        // Emit event to all participants in the conversation
        participants.forEach((participant: string) => {
          console.log('hi0----', participant);
          io.to(participant).emit('conversationCreated', savedConversation);
        });

        res.status(201).json({ conversationId: savedConversation._id });
      })
      .catch((err) => {
        console.error('Failed to create conversation:', err);
        res.status(500).send('Failed to create conversation');
      });
  });

  // Get all conversations
  router.get('/', (req: Request, res: Response) => {
    ConversationModel.find()
      .then((conversations) => {
        res.json(conversations);
      })
      .catch((err) => {
        console.error('Failed to get conversations:', err);
        res.status(500).send('Failed to get conversations');
      });
  });

  return router;
};

export default conversationRoutes;