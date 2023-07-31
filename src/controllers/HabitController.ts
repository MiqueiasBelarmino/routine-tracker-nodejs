import { HabitService } from './../services/HabitService';
import { z } from 'zod';
import { Request, Response } from 'express';
import { dateToMidnightISODate } from '../utils/helpers';

export class HabitController {

    static habitService = new HabitService();

    create = async (req: Request, res: Response) => {
        const createHabitParams = z.object({
            name: z.string().min(5),
            schedule: z.string().trim().min(1),
            weekDays: z.array(
                z.number().min(0).max(6)
            ).min(1),
            user_id: z.string().uuid()
        })

        try {
            const habit = createHabitParams.parse(req.body);
            const createdHabit = await new HabitService().create(habit);
            res.json(createdHabit);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findAll = async (req: Request, res: Response) => {
        const findAllParams = z.object({
            user_id: z.string().uuid()
        })

        try {
            const { user_id } = findAllParams.parse(req.body);
            const habits = await new HabitService().findAll(user_id);
            res.json(habits);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findById = async (req: Request, res: Response) => {

        const params = z.object({
            id: z.string().uuid()
        })

        const body = z.object({
            user_id: z.string().uuid()
        })

        try {
            const { id } = params.parse(req.params);
            const { user_id } = body.parse(req.body);
            const habits = await new HabitService().findById(id, user_id);
            res.json(habits);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findByDay = async (req: Request, res: Response) => {

        const dayParams = z.object({
            date: z.coerce.date(),
            user_id: z.string().uuid()
        })

        try {
            const { date, user_id} = dayParams.parse(req.body);
            const habits = await new HabitService().findByDay(date, user_id);
            res.json(habits);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    update = async (req: Request, res: Response) => {
        const updateHabitBody = z.object({
            name: z.string().min(5),
            schedule: z.string().trim().min(1),
            isCompleted: z.boolean(),
            weekDays: z.array(
                z.number().min(0).max(6)
            ).min(1),
        })

        const updateHabitParams = z.object({
            id: z.string().uuid()
        })

        try {
            const { id } = updateHabitParams.parse(req.params);
            const habit = updateHabitBody.parse(req.body);
            const updatedHabit = await new HabitService().update(id, habit);
            res.json(updatedHabit);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    delete = async (req: Request, res: Response) => {

        const deleteHabitParams = z.object({
            id: z.string().uuid()
        })

        const body = z.object({
            user_id: z.string().uuid()
        })

        try {
            const { id } = deleteHabitParams.parse(req.params);
            const { user_id } = body.parse(req.body);
            const deletedHabit = await new HabitService().delete(id, user_id);
            if(deletedHabit.statusCode){
                res.status(deletedHabit.statusCode).send(deletedHabit.message);
            }else{
                res.json(deletedHabit);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    toggle = async (req: Request, res: Response) => {

        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const toggleHabitBody = z.object({
            date: z.coerce.date(),
            user_id: z.string().uuid()
        })

        try {
            const { id } = toggleHabitParams.parse(req.params);
            const { date, user_id } = toggleHabitBody.parse(req.body);
            const habit = await new HabitService().toggle(id, dateToMidnightISODate(date), user_id);
            res.json(habit);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    summary = async (req: Request, res: Response) => {

        try {
            const habits = await new HabitService().summary();
            res.json(habits);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}