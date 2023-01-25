import { HabitController } from './../controllers/HabitController';
import { Router } from 'express';

const habitsRouter = Router();

habitsRouter.get('/habits', new HabitController().findAll);
habitsRouter.get('/habits/:id', new HabitController().findById);
habitsRouter.post('/habits', new HabitController().create);
habitsRouter.put('/habits/:id', new HabitController().update);
habitsRouter.delete('/habits/:id', new HabitController().delete);

habitsRouter.get('/day', new HabitController().findByDay)

export default habitsRouter;