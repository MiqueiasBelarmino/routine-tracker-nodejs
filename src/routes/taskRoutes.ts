import { authenticated } from '../middlewares/authenticated';
import { TaskController } from './../controllers/TaskController';
import { Router } from 'express';

const taskRouter = Router();
const taskController = new TaskController();

taskRouter.get('/tasks', authenticated, taskController.findAll);
taskRouter.post('/tasks', authenticated, taskController.create);

taskRouter.get('/tasks/:id', authenticated, taskController.findById);
taskRouter.put('/tasks/:id', authenticated, taskController.update);
taskRouter.delete('/tasks/:id', authenticated, taskController.delete);

taskRouter.patch('/tasks/:id/toggle', authenticated, taskController.toggle);

export default taskRouter;