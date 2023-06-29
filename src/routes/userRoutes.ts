import { UserController } from '../controllers/UserController';
import { Router } from 'express';
import { authenticated } from '../middlewares/authenticated';

const usersRouter = Router();
const userController = new UserController(); 

usersRouter.post('/users', authenticated, userController.create);

usersRouter.post('/users/authenticate', userController.authenticate);

export default usersRouter;