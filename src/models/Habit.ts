import { Habit as HabitSchema } from "@prisma/client";

export class Habit implements HabitSchema {
    id!: string;
    name!: string;
    schedule!: string;
    createdAt!: Date;
    weekDays!: number[];
}