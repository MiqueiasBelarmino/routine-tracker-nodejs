import { HabitController } from './../controllers/HabitController';
import { Router } from 'express';

const habitsRouter = Router();

habitsRouter.get('/habits', new HabitController().findAll);
habitsRouter.post('/habits', new HabitController().create);
habitsRouter.get('/day', new HabitController().findByDay)

export default habitsRouter;