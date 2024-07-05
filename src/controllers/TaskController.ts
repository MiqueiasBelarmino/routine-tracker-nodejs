import { TaskService } from '../services/TaskService';
import { z } from 'zod';
import { Request, Response } from 'express';

export class TaskController {

    static habitService = new TaskService();

    create = async (req: Request, res: Response) => {
        const createTaskParams = z.object({
            name: z.string().min(5),
            targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            priority: z.number().min(0).max(3),
            userId: z.string().uuid()
        })

        
        try {
            const task = createTaskParams.parse(req.body);
            const createdTask = await (new TaskService()).create(task);
            res.json(createdTask);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findAll = async (req: Request, res: Response) => {
        const params = z.object({
            userId: z.string().uuid()
        })
        
        try {

            const { userId } = params.parse(req.body);
            const tasks = await new TaskService().findAll(userId);
            res.json(tasks);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findById = async (req: Request, res: Response) => {

        const params = z.object({
            id: z.string().uuid()
        })

        const deleteTaskBody = z.object({
            userId: z.string().uuid()
        })

        try {
            const { id } = params.parse(req.params);
            const { userId } = deleteTaskBody.parse(req.body);
            const task = await new TaskService().findById(id, userId);
            res.json(task);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    findByDay = async (req: Request, res: Response) => {

        const dayParams = z.object({
            date: z.coerce.date(),
            userId: z.string().uuid()
        })

        try {
            const { date, userId } = dayParams.parse(req.body);
            const tasks = await new TaskService().findByDay(date, userId);
            res.json(tasks);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    update = async (req: Request, res: Response) => {
        const updateTaskBody = z.object({
            name: z.string().min(5),
            targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            priority: z.number().min(0).max(3),
            isCompleted: z.boolean(),
        })

        const updateTaskParams = z.object({
            id: z.string().uuid()
        })

        try {
            const { id } = updateTaskParams.parse(req.params);
            const task = updateTaskBody.parse(req.body);
            const updatedTask = await new TaskService().update(id, task);
            res.json(updatedTask);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    delete = async (req: Request, res: Response) => {

        const deleteTaskParams = z.object({
            id: z.string().uuid()
        })

        const deleteTaskBody = z.object({
            userId: z.string().uuid()
        })

        try {
            const { id } = deleteTaskParams.parse(req.params);
            const { userId } = deleteTaskBody.parse(req.body);
            const deletedTask = await new TaskService().delete(id, userId);
            if(deletedTask.statusCode){
                res.status(deletedTask.statusCode).json({ data: {message: deletedTask.message } });
            }else {
                res.json(deletedTask);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    toggle = async (req: Request, res: Response) => {

        const toggleTaskParams = z.object({
            id: z.string().uuid(),
        })

        const toggleTaskBody = z.object({
            date: z.coerce.date(),
            userId: z.string().uuid()
        })

        try {
            const { id } = toggleTaskParams.parse(req.params);
            const { date, userId } = toggleTaskBody.parse(req.body);
            const task = await new TaskService().toggle(id, date, userId);
            res.json(task);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}