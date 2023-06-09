import { Router, Request, Response } from 'express';
import { MessageModel } from '../models/message';
import { ConversationModel } from '../models/conversation';
import { Server as SocketIOServer } from 'socket.io';
import { randomUUID } from 'crypto';
import * as Moment from 'moment';
const router: Router = Router();

export const formatDate = (date: any) => {
  if (!date) return date;
  return Moment.utc(date).format('D MMM YYYY MM:SS');
  // return Moment(date).format(i18n.getDateFormat('standard'));
};

const messageRoutes = (io: SocketIOServer) => {
  // Create a new message
  router.post('/send', async (req: Request, res: Response) => {
    const { conversationId, senderId, toUserId, content } = req.body.data;


    let pConversationId = conversationId;
    let participants = [ senderId, toUserId ];
    console.log('from message send', conversationId )
    if (!conversationId) {
      const conversation = new ConversationModel({
        name: '',
        participants: [senderId, toUserId],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('before conv save', conversation);
      const result = await conversation.save();
      console.log('from conv save', result._id)
      pConversationId = result._id;
    }
    const message = new MessageModel({
      conversationId: pConversationId,
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
        // io.to(conversationId).emit('messageCreated', savedMessage);
        participants.forEach((participant: string) => {
          console.log('socket send', participant, savedMessage)
          io.to(participant).emit('message', savedMessage);
        });
        res.status(201).json({ messageId: savedMessage._id, conversationId: savedMessage.conversationId });
      })
      .catch((err) => {
        console.error('Failed to create message:', err);
        res.status(500).send('Failed to create message');
      });
  });

  router.get('/user-messages/:userId1/:userId2', async (req: Request, res: Response) => {
    console.log('from route user-messages', req.params)
    try {
      const userId1 = req.params.userId1;
      const userId2 = req.params.userId2;
  
      // Find the conversation with the given participants
      const conversation = await ConversationModel.findOne({
        participants: { $all: [userId1, userId2] },
      });
      console.log('from user-messages conversation', conversation)
      if (!conversation) {
        return res.status(200).json({ data: [] });
      }
  
      // Retrieve messages based on the conversationId
      const messages = await MessageModel.find({ conversationId: conversation._id }).lean();
      console.log('from messages', messages);
      const result = messages.map(m => {
        const obj = { ...m };
        obj.timestamp = formatDate(obj.timestamp);
        return obj;
      })
      res.json({data : result});
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ data: 'Internal server error' });
    }});
  return router;

}
export default messageRoutes;