import { dateToMidnightISODate } from "../../util";
import { PrismaClientCon } from "../lib/prisma"
import { Habit } from "../models/Habit";

export class HabitService {

    static prisma = PrismaClientCon;

    create = async (habit: Partial<Habit>) => {
        const weekDays = habit.weekDays?.map((day) => { return { week_day: day } });

        const createdHabit = await HabitService.prisma.habit.create({
            data: {
                name: habit.name!,
                createdAt: habit.createdAt || dateToMidnightISODate(new Date()),
                isCompleted: habit.isCompleted || false,
                schedule: habit.schedule || 'D',
                weekDays: {
                    create: weekDays
                }
            }
        });
        return createdHabit;
    }

    findAll = async () => {
        const availableHabits = await HabitService.prisma.habit.findMany();
        return { availableHabits };
    }

    findById = async (id: string) => {
        const availableHabits = await HabitService.prisma.habit.findUnique({
            where: {
                id: id
            }
        });

        return { availableHabits }
    }

    findByDay = async (date: Date) => {
        const weekDay = dateToMidnightISODate(date).getDay();
        const parsedDate = dateToMidnightISODate(date);

        const availableHabits = await HabitService.prisma.habit.findMany({
            where: {
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        });

        const day = await HabitService.prisma.day.findUnique({
            where: {
                date: parsedDate
            },
            include: {
                dayHabits: true
            }

        });

        const completedHabits = day?.dayHabits.map((dayHabit) => {
            return dayHabit.habit_id
        });

        console.log(day);
        console.log(completedHabits);

        return {
            availableHabits,
            completedHabits
        }
    }

    update = async (id: string, habit: Partial<Habit>) => {
        const weekDays = habit.weekDays?.map((day) => { return { week_day: day } });

        const updatedHabit = await HabitService.prisma.habit.update({
            data: {
                name: habit.name!,
                isCompleted: habit.isCompleted || false,
                schedule: habit.schedule || 'D',
                weekDays: {
                    deleteMany: {
                        habit_id: habit.id
                    },
                    create: weekDays
                }
            },
            where: {
                id: id
            }
        });
        return updatedHabit;
    }

    delete = async (id: string) => {
        await HabitService.prisma.habitWeekDay.deleteMany({
            where: {
                habit_id: id
            }
        })

        await HabitService.prisma.dayHabit.deleteMany({
            where: {
                habit_id: id
            }
        })

        const deletedHabit = await HabitService.prisma.habit.delete({
            where:{
                id: id
            }
        });
        return deletedHabit;
    }


}