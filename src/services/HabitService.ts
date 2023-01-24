
import { dateToMidnightISODate } from "../../util";
import { PrismaClientCon } from "../lib/prisma"
import { Habit } from "../models/Habit";

export class HabitService {

    static prisma = PrismaClientCon;

    create = async (habit: Partial<Habit>) => {
        const weekDays = habit.weekDays?.map((day)=> { return { week_day: day }});

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
        return await HabitService.prisma.habit.findMany();
    }

    findByDay = async (date: Date) => {
        const weekDay = dateToMidnightISODate(date).getDay();

        const availableHabits = await HabitService.prisma.habit.findMany({
            where:{
                weekDays: {
                    some:{
                        week_day: weekDay
                    }
                }
            }
        });

        const completed = await HabitService.prisma.habit.findMany({
            where:{
                weekDays: {
                    some:{
                        week_day: weekDay
                    }
                },
                isCompleted: {
                    equals: true
                }
            }
        });
        const completedHabits = completed.map((habit) => habit.id);

        return {
            availableHabits,
            completedHabits
        }
    }


}