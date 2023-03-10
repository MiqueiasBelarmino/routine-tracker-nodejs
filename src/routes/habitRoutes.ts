import { HabitController } from './../controllers/HabitController';
import { Router } from 'express';

const habitsRouter = Router();
const habitController = new HabitController();

habitsRouter
.route('/habits')
.get(habitController.findAll)
.post(habitController.create);

habitsRouter
.route('/habits/:id')
.get(habitController.findById)
.put(habitController.update)
.delete(habitController.delete);

habitsRouter.patch('/habits/:id/toggle', habitController.toggle);
habitsRouter.get('/day', habitController.findByDay);
habitsRouter.get('/summary', habitController.summary);

export default habitsRouter;