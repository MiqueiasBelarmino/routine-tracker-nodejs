import { Habit } from './../models/Habit';
import { dateToMidnightISODate } from "../utils/helpers";
import { PrismaClientCon } from "../lib/prisma"
import { SCHEDULE } from "../utils/consts";

export class HabitService {

    static prisma = PrismaClientCon;

    create = async (habit: Partial<Habit>) => {
        const weekDays = habit.weekDays?.map((day) => { return { week_day: day } });

        const createdHabit = await HabitService.prisma.habit.create({
            data: {
                name: habit.name!,
                createdAt: habit.createdAt || dateToMidnightISODate(new Date()),
                schedule: habit.schedule || SCHEDULE.ALL_DAY,
                weekDays: {
                    create: weekDays
                },
                user_id: habit.user_id!
            }
        });
        return { createdHabit };
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
                createdAt: {
                    lte: parsedDate
                },
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
        
        const mappedHabits = availableHabits.map((habit)=>{
            return {
                ...habit,
                done: completedHabits?.includes(habit.id) || false
            }
        });

        return {
            availableHabits: mappedHabits.sort(( a, b )=> {
                if ( a.done < b.done ){
                  return -1;
                }
                if ( a.done > b.done ){
                  return 1;
                }
                return 0;
              })
        }
    }

    update = async (id: string, habit: Partial<Habit>) => {
        const weekDays = habit.weekDays?.map((day) => { return { week_day: day } });

        const updatedHabit = await HabitService.prisma.habit.update({
            data: {
                name: habit.name!,
                schedule: habit.schedule || SCHEDULE.ALL_DAY,
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
            where: {
                id: id
            }
        });
        return deletedHabit;
    }

    toggle = async (id: string, date: Date, userId: string) => {

        let day = await HabitService.prisma.day.findUnique({
            where: {
                date: date
            }
        });

        if (!day) {
            day = await HabitService.prisma.day.create({
                data: {
                    date: date
                }
            });
        }

        const dayHabit = await HabitService.prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        });

        if (dayHabit) {
            await HabitService.prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
            
            return "uncompleted";
        } else {
            await HabitService.prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                    user_id: userId
                }
            })

            return "completed";
        }
    }

    summary = async () => {

        const summary = await HabitService.prisma.$queryRaw `--sql
            SELECT
                D.id,
                D.date,
                (
                    SELECT
                        CAST(COUNT(*) AS FLOAT)
                    FROM 
                        day_habits DH
                    WHERE
                        DH.day_id = D.id
                ) AS completed,
                (
                    SELECT
                        CAST(COUNT(*) AS FLOAT)
                    FROM 
                        habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE
                        HWD.week_day = CAST(strftime('%w', D.date/1000.0,'unixepoch') AS INT)
                        AND (H.createdAt = D.date OR H.createdAt < D.date)
                ) AS amount
            FROM
                days D        
        `

        return summary;
    }


}