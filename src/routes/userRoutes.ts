import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { auth_url } from '../../config.json';
const router: Router = Router();

const userRoutes =  (onlineUsers: Map<string, boolean>) => {
  // Get all Users
  router.get('/', async (req: Request, res: Response) => {
    console.log('from url', `${auth_url}/all-users`)
    const users = await fetch(`${auth_url}/all-users`);
    console.log('from get all users', users);

  });

  router.get('/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const users = await fetch(`${auth_url}/users/${userId}`);

  });
  return router;
};

export default userRoutes;