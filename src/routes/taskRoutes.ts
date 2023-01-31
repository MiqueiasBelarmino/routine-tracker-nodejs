import { TaskController } from './../controllers/TaskController';
import { HabitController } from '../controllers/HabitController';
import { Router } from 'express';

const taskRouter = Router();
const taskController = new TaskController();

taskRouter
.route('/tasks')
.get(taskController.findAll)
.post(taskController.create);

taskRouter
.route('/tasks/:id')
.get(taskController.findById)
.put(taskController.update)
.delete(taskController.delete);

taskRouter.patch('/tasks/:id/toggle', taskController.toggle);

export default taskRouter;