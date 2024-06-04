import { UserController } from '../controllers/UserController';
import { Router } from 'express';
import { authenticated } from '../middlewares/authenticated';

const usersRouter = Router();
const userController = new UserController(); 

usersRouter.post('/users', userController.create);
usersRouter.post('/users/authenticate', userController.authenticate);
usersRouter.get('/users/load-session', authenticated, userController.loadSession);

export default usersRouter;