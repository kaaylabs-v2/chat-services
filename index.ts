import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { connect, close } from './src/db';
import conversationRoutes from './src/routes/conversationRoutes';
import messageRoutes from './src/routes/messageRoutes';
import userRoutes from './src/routes/userRoutes';
const app: Application = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Create HTTP server
const server = http.createServer(app);
// Data structure to track online status
const onlineUsers: Map<string, boolean> = new Map();
// Connect to MongoDB
connect((err: Error | null) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }

  // Create Socket.IO server
  const io = new SocketIOServer(server);

  // Set up WebSocket connection
  io.on('connection', (socket: Socket) => {
    console.log('New socket connection:', socket.id);
      // Handle user login
  socket.on('login', (userId: string) => {
    onlineUsers.set(userId, true);
    console.log(`User ${userId} is online`);
  });

  // Handle user logout or disconnect
  socket.on('logout', (userId: string) => {
    onlineUsers.delete(userId);
    console.log(`User ${userId} is offline`);
  });

    // Join a conversation room
    socket.on('joinRoom', (conversationId: string) => {
      socket.join(conversationId);
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
  // Endpoint to check user's online status
  app.use('/api/users', userRoutes(onlineUsers));
  // Start the server
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});