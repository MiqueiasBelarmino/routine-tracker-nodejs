import { HabitService } from './../services/HabitService';
import { z } from 'zod';
import { Request, Response } from 'express';

export class HabitController {

    static habitService = new HabitService();

    create = async(req: Request, res: Response) =>{
        const createHabitParams = z.object({
            name: z.string(),
            schedule: z.string().trim(),
            weekDays: z.array(
                z.number().min(0).max(6)
            ),
        })
    
        try {
            const habit  = createHabitParams.parse(req.body);
            const createdHabit = await new HabitService().create(habit);
            res.status(200).send(createdHabit);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findAll = async (req: Request, res: Response) => {

        try {
            const habits = await new HabitService().findAll();
            res.status(200).send(habits);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findByDay = async (req: Request, res: Response) => {

        const dayParams = z.object({
            date: z.coerce.date()
        })
    
        try {
            const { date } = dayParams.parse(req.body);
            const habits = await new HabitService().findByDay(date);
            res.status(200).send(habits);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}