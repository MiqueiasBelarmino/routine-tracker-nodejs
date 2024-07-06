import { UserService } from '../services/UserService';
import { ZodError, z } from 'zod';
import { Request, Response } from 'express';

export class UserController {

    static userService = new UserService();

    create = async (req: Request, res: Response) => {
        const createUserParams = z.object({
            name: z.string().trim().min(5),
            username: z.string().trim().min(5),
            password: z.string().trim().min(5),
        })

        try {
            const user = createUserParams.parse(req.body);
            const createdUser = await UserController.userService.create(user);
            res.json(createdUser);
        } catch (error) {
            if(error instanceof ZodError){
                res.status(500).send({issues: error.issues});
            }else {
                res.status(500).send(error);
            }
        }
    }

    authenticate = async (req: Request, res: Response) => {
        const authUserParams = z.object({
            username: z.string().trim().min(8),
            password: z.string().trim().min(8),
        })

        try {
            const user = authUserParams.parse(req.body);
            const authenticatedUser = await UserController.userService.authenticate(user);
            
            res.json(authenticatedUser);
        } catch (error) {
            if(error instanceof ZodError){
                res.status(500).send({issues: error.issues});
            }else {
                res.status(500).send(error);
            }
        }
    }

    loadSession = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[1] || '';
        if(token.length < 1){
            res.status(401).send({message: "Token is missing"});
        }

        try {
            const session = await UserService.loadSession(token);
            res.json(session);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}