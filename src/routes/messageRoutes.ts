import { Router, Request, Response } from 'express';
import { MessageModel } from '../models/message';
import { Server as SocketIOServer } from 'socket.io';

const router: Router = Router();

const messageRoutes = (io: SocketIOServer) => {
  // Create a new message
  router.post('/', (req: Request, res: Response) => {
    const { conversationId, senderId, content } = req.body;

    const message = new MessageModel({
      conversationId,
      senderId,
      content,
      timestamp: new Date(),
      readBy: [],
      attachmentUrl: ''
    });

    message.save()
      .then((savedMessage) => {
        console.log('Message created:', savedMessage._id);

        // Emit event to all participants in the conversation
        io.to(conversationId).emit('messageCreated', savedMessage);

        res.status(201).json({ messageId: savedMessage._id });
      })
      .catch((err) => {
        console.error('Failed to create message:', err);
        res.status(500).send('Failed to create message');
      });
  });

  // Get all messages for a conversation
  router.get('/:conversationId', (req: Request, res: Response) => {
    const { conversationId } = req.params;

    MessageModel.find({ conversationId })
      .then((messages) => {
        res.json(messages);
      })
      .catch((err) => {
        console.error('Failed to get messages:', err);
        res.status(500).send('Failed to get messages');
      });
  });

  return router;
};

export default messageRoutes;