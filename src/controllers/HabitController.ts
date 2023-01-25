import { HabitService } from './../services/HabitService';
import { z } from 'zod';
import { Request, Response } from 'express';

export class HabitController {

    static habitService = new HabitService();

    create = async (req: Request, res: Response) => {
        const createHabitParams = z.object({
            name: z.string(),
            schedule: z.string().trim(),
            weekDays: z.array(
                z.number().min(0).max(6)
            ),
        })

        try {
            const habit = createHabitParams.parse(req.body);
            const createdHabit = await new HabitService().create(habit);
            res.json({ data: createdHabit });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findAll = async (req: Request, res: Response) => {

        try {
            const habits = await new HabitService().findAll();
            res.json({ data: habits });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findById = async (req: Request, res: Response) => {

        const params = z.object({
            id: z.string().uuid()
        })

        try {
            const { id } = params.parse(req.params);
            const habits = await new HabitService().findById(id);
            res.json({data: habits});
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
            res.json({data: habits});
        } catch (error) {
            res.status(500).send(error);
        }
    }

    update = async (req: Request, res: Response) => {
        const updateHabitBody = z.object({
            name: z.string(),
            schedule: z.string().trim(),
            isCompleted: z.boolean(),
            weekDays: z.array(
                z.number().min(0).max(6)
            ),
        })

        const updateHabitParams = z.object({
            id: z.string().uuid()
        })

        try {
            const { id } = updateHabitParams.parse(req.params);
            const habit = updateHabitBody.parse(req.body);
            const updatedHabit = await new HabitService().update(id, habit);
            res.json({ data: updatedHabit });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    delete = async (req: Request, res: Response) => {

        const deleteHabitParams = z.object({
            id: z.string().uuid()
        })

        try {
            const { id } = deleteHabitParams.parse(req.params);
            const deletedHabit = await new HabitService().delete(id);
            res.json({ data: deletedHabit });
        } catch (error) {
            res.status(500).send(error);
        }
    }

}