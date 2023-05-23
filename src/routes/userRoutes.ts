import { UserController } from '../controllers/UserController';
import { Router } from 'express';

const usersRouter = Router();
const userController = new UserController(); 

usersRouter
.route('/users')
.post(userController.create);

usersRouter
.route('/users/authenticate')
.post(userController.authenticate);

export default usersRouter;