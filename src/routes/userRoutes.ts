import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { auth_url } from '../../config.json';
import axios from 'axios';
const router: Router = Router();

const userRoutes = (onlineUsers: []) => {
    // Get all Users
    router.get('/', async (req: Request, res: Response) => {
        const usersJSON = await axios.get(`${auth_url}/all-users`);
        const usersData: any = usersJSON.data;
        const data = usersData.data.map((u: any) => {
            const obj = { ...u };
            obj.userId = u.uid;
            obj.online = onlineUsers.find((o) => o === u.uid) ? true : false;
            return obj;
        }
        )
        const result = data.sort((a: any, b:any) => a.online === true ? -1 : 1);
        res.status(200).send({ data: result });
    });

    router.get('/:userId', async (req: Request, res: Response) => {
        const { userId } = req.params;
        const users = await fetch(`${auth_url}/users/${userId}`);

    });
    return router;
};

export default userRoutes;