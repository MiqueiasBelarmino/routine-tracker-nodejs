import { Task as TaskSchema } from "@prisma/client";

export class Task implements TaskSchema {
    id!: string;
    name!: string;
    targetDate!: Date; 
    priority!: number; 
    createdAt!: Date; 
    isCompleted!: boolean;
    userId!: string;
}