import { Task as TaskSchema } from "@prisma/client";

export class Task implements TaskSchema {
    id!: string;
    name!: string;
    target_date!: Date; 
    priority!: number; 
    createdAt!: Date; 
    isCompleted!: boolean;
    user_id!: string;
}