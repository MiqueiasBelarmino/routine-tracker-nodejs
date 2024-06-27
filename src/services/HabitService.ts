import { Habit } from './../models/Habit';
import { dateToMidnightISODate } from "../utils/helpers";
import { PrismaClientCon } from "../lib/prisma"
import { SCHEDULE } from "../utils/consts";

export class HabitService {

    static prisma = PrismaClientCon;

    create = async (habit: Partial<Habit>) => {
        const weekDays = habit.weekDays?.map((day) => { return { weekDay: day } });

        const createdHabit = await HabitService.prisma.habit.create({
            data: {
                name: habit.name!,
                createdAt: habit.createdAt || dateToMidnightISODate(new Date()),
                schedule: habit.schedule || SCHEDULE.ALL_DAY,
                weekDays: {
                    create: weekDays
                },
                userId: habit.userId!
            }
        });
        return { createdHabit };
    }

    findAll = async (userId: string) => {
        const availableHabits = await HabitService.prisma.habit.findMany({
            where: {
                userId: userId
            }
        });
        return { availableHabits };
    }

    findById = async (id: string, userId: string) => {
        const availableHabits = await HabitService.prisma.habit.findMany({
            where: {
                id: {
                    equals: id
                },
                userId: {
                    equals: userId
                }
            },
            
        });

        return { availableHabits }
    }

    findByDay = async (date: Date, userId: string) => {
        const weekDay = dateToMidnightISODate(date).getDay();
        const parsedDate = dateToMidnightISODate(date);

        const availableHabits = await HabitService.prisma.habit.findMany({
            where: {
                createdAt: {
                    lte: parsedDate
                },
                weekDays: {
                    some: {
                        weekDay: weekDay
                    }
                },
                userId: {
                    equals: userId
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

        const completedHabits = day?.dayHabits.map((dayHabit: any) => {
            return dayHabit.habitId
        });
        
        const mappedHabits = availableHabits.map((habit: any)=>{
            return {
                ...habit,
                done: completedHabits?.includes(habit.id) || false
            }
        });

        return {
            availableHabits: mappedHabits.sort(( a: any, b: any )=> {
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
        const weekDays = habit.weekDays?.map((day) => { return { weekDay: day } });

        const updatedHabit = await HabitService.prisma.habit.update({
            data: {
                name: habit.name!,
                schedule: habit.schedule || SCHEDULE.ALL_DAY,
                weekDays: {
                    deleteMany: {
                        habitId: habit.id
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

    delete = async (id: string, userId: string) => {
        const habit = await HabitService.prisma.habit.findMany({
            where: {
                id: id,
                userId: userId
            }
        });

        if(habit){
            const habitWeekDay = await HabitService.prisma.habitWeekDay.deleteMany({
                where: {
                    habitId: id
                }
            })
            
            const dayHabit = await HabitService.prisma.dayHabit.deleteMany({
                where: {
                    habitId: id,
                    userId: userId
                }
            })
            const deletedHabit = await HabitService.prisma.habit.delete({
                where: {
                    id: id
                }
            });

            return { deletedHabit };
        }else{
            return { statusCode: 404, message: "Habit not found"}
        }
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
                dayId_habitId: {
                    dayId: day.id,
                    habitId: id
                }
            }
        });

        if (dayHabit) {
            await HabitService.prisma.dayHabit.deleteMany({
                where: {
                    id: dayHabit.id,
                    userId: {
                        equals: userId
                    }
                }
            })
            
            return "uncompleted";
        } else {
            await HabitService.prisma.dayHabit.create({
                data: {
                    dayId: day.id,
                    habitId: id,
                    userId: userId
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
                        habit_weekDays HWD
                    JOIN habits H
                        ON H.id = HWD.habitId
                    WHERE
                        HWD.weekDay = CAST(strftime('%w', D.date/1000.0,'unixepoch') AS INT)
                        AND (H.createdAt = D.date OR H.createdAt < D.date)
                ) AS amount
            FROM
                days D        
        `

        return summary;
    }


}