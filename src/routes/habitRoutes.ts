import { HabitController } from './../controllers/HabitController';
import { Router } from 'express';

const habitsRouter = Router();
const habitController = new HabitController();

habitsRouter
.route('/api/habits')
.get(habitController.findAll)
.post(habitController.create)

habitsRouter
.route('/api/habits/:id')
.get(habitController.findById)
.put(habitController.update)
.delete(habitController.delete)

habitsRouter.patch('/api/habits/:id/toggle', habitController.toggle);
habitsRouter.get('/api/day', habitController.findByDay)

export default habitsRouter;