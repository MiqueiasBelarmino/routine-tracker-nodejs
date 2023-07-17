import { Task } from './../models/Task';
import { dateToMidnightISODate } from "../utils/helpers";
import { PrismaClientCon } from "../lib/prisma"

export class TaskService {

    static prisma = PrismaClientCon;

    create = async (task: Partial<Task>) => {

        const createdTask = await TaskService.prisma.task.create({
            data: {
                user_id: task.user_id!,
                name: task.name!,
                target_date: task.target_date || dateToMidnightISODate(new Date()),
                priority: Number(task.priority),
                isCompleted: task.isCompleted || false,
                createdAt: dateToMidnightISODate(new Date())
            }
        });
        return { createdTask };
    }

    findAll = async () => {
        const availableTasks = await TaskService.prisma.task.findMany();
        return { availableTasks };
    }

    findById = async (id: string) => {
        const task = await TaskService.prisma.task.findUnique({
            where: {
                id: id
            }
        });

        return { task }
    }

    findByDay = async (date: Date) => {
        const parsedDate = dateToMidnightISODate(date);

        const availableTasks = await TaskService.prisma.task.findMany({
            where: {
                createdAt: parsedDate,
            }
        });

        return { availableTasks }
    }

    update = async (id: string, task: Partial<Task>) => {

        const updatedTask = await TaskService.prisma.task.update({
            data: {
                name: task.name!,
                target_date: task.target_date || dateToMidnightISODate(new Date()),
                priority: task.priority || 3,
                isCompleted: task.isCompleted || false,
                createdAt: dateToMidnightISODate(new Date())
            },
            where: {
                id: id
            }
        });
        return { updatedTask };
    }

    delete = async (id: string) => {
        const task = await TaskService.prisma.task.findUnique({
            where: {
                id: id
            }
        });

        if(task){
            const deletedTask = await TaskService.prisma.task.delete({
                where: {
                    id: id
                }
            });

            return { deletedTask };
        }else{
            return { statusCode: 404, message: "Task not found"}
        }

    }

    toggle = async (id: string, date: Date) => {

        let task = await TaskService.prisma.task.findUnique({
            where: {
                id: id
            }
        });

        if (task) {
            let isCompleted = false;

            if (!task.isCompleted) {
                isCompleted = true;
            }

            await TaskService.prisma.task.update({
                data: {
                    isCompleted: true
                },
                where: {
                    id: task.id
                }
            })

            return isCompleted?"checked":"unchecked";

        }
    }


}