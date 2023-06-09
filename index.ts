import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { connect, close } from './src/db';
import conversationRoutes from './src/routes/conversationRoutes';
import messageRoutes from './src/routes/messageRoutes';
import userRoutes from './src/routes/userRoutes';
const net = require("net");

const app: Application = express();
const port = 8000;

if (net.setDefaultAutoSelectFamily) {
  net.setDefaultAutoSelectFamily(false);
}
// Middleware
app.use(bodyParser.json());
app.use(cors());
// Create HTTP server
const server = http.createServer(app);
// Data structure to track online status
const onlineUsers:any = [];
// Connect to MongoDB
connect((err: Error | null) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }

  // Create Socket.IO server
  const io = require("socket.io")(server, {
    cors: {
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  // Set up WebSocket connection
  io.on('connection', (socket: Socket) => {
    console.log('New socket connection:', socket.id);
      // Handle user login
  socket.on('login', ({ userId }) => {
    console.log(`User ${userId} is online`);
    onlineUsers.push(userId);
    socket.join(userId);
    io.emit('user-login', userId);
  });

  // Handle user logout or disconnect
  socket.on('logout', ({ userId }) => {
    const deleteIndex = onlineUsers.indexOf(userId);
    if (deleteIndex > -1) {
      onlineUsers.splice(deleteIndex, 1);
    }
    io.emit('user-logout', userId);
    console.log(`User ${userId} is offline`);
  });

    // Join a conversation room
    socket.on('joinRoom', (conversationId: string) => {
      console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  // Set up routes
  app.use('/api/conversations', conversationRoutes(io));
  app.use('/api/messages', messageRoutes(io));
  app.use('/api/users', userRoutes(onlineUsers));
  // Start the server
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});