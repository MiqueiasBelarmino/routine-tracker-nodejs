import { Task } from './../models/Task';
import { dateToMidnightISODate } from "../utils/helpers";
import { PrismaClientCon } from "../lib/prisma"

export class TaskService {

    static prisma = PrismaClientCon;

    create = async (task: Partial<Task>) => {

        const createdTask = await TaskService.prisma.task.create({
            data: {
                userId: task.userId!,
                name: task.name!,
                targetDate: task.targetDate || dateToMidnightISODate(new Date()),
                priority: Number(task.priority),
                isCompleted: task.isCompleted || false,
                createdAt: dateToMidnightISODate(new Date())
            }
        });
        return { createdTask };
    }

    findAll = async (userId: string) => {
        const availableTasks = await TaskService.prisma.task.findMany({
            where: {
                userId: {
                    equals: userId
                }
            }
        });
        return { availableTasks };
    }

    findById = async (id: string, userId: string) => {
        const task = await TaskService.prisma.task.findMany({
            where: {
                id: id,
                userId: {
                    equals: userId
                }
            }
        });

        return { task }
    }

    findByDay = async (date: Date, userId: string) => {
        const parsedDate = dateToMidnightISODate(date);

        const availableTasks = await TaskService.prisma.task.findMany({
            where: {
                createdAt: parsedDate,
                userId: {
                    equals: userId
                }
            }
        });

        return { availableTasks }
    }

    update = async (id: string, task: Partial<Task>) => {

        const updatedTask = await TaskService.prisma.task.update({
            data: {
                name: task.name!,
                targetDate: task.targetDate || dateToMidnightISODate(new Date()),
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

    delete = async (id: string, userId: string) => {
        const task = await TaskService.prisma.task.findMany({
            where: {
                id: id,
                userId: {
                    equals: userId
                }
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

    toggle = async (id: string, date: Date, userId: string) => {

        let tasks = await TaskService.prisma.task.findMany({
            where: {
                id: id,
                userId: {
                    equals: userId
                }
            }
        });

        const task = tasks[0];

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