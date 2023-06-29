import { authenticated } from '../middlewares/authenticated';
import { HabitController } from './../controllers/HabitController';
import { Router } from 'express';

const habitsRouter = Router();
const habitController = new HabitController();

habitsRouter.get('/habits', authenticated, habitController.findAll);
habitsRouter.post('/habits', authenticated, habitController.create);

habitsRouter.get('/habits/:id', authenticated, habitController.findById);
habitsRouter.put('/habits/:id', authenticated, habitController.update);
habitsRouter.delete('/habits/:id', authenticated, habitController.delete);

habitsRouter.patch('/habits/:id/toggle', authenticated, habitController.toggle);
habitsRouter.post('/day', authenticated, habitController.findByDay);
habitsRouter.get('/summary', authenticated, habitController.summary);

export default habitsRouter;