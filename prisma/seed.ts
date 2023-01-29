import { PrismaClientCon as prisma } from '../src/lib/prisma';
import { SCHEDULE } from '../src/utils/consts';
import { addDays, dateToMidnightISODate } from '../util';

async function main() {

  await prisma.habitWeekDay.deleteMany();
  await prisma.dayHabit.deleteMany();
  await prisma.day.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.task.deleteMany();

  // const firstHabitId = '068ba380-decb-496d-b762-58fefea6569c';
  // const secondHabitId = '2357c721-5479-4c6d-9c2f-1dae308fa89d';
  // const thirdHabitId = '704f8036-8563-4208-9150-22d14f48d252';

  await Promise.all([
    prisma.habit.create({
      data: {
        // id: firstHabitId,
        name: 'Acordar cedo',
        createdAt: new Date('2023-01-15T03:00:00.000Z'),
        schedule: SCHEDULE.MONING,
        weekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    }),
    prisma.habit.create({
      data: {
        // id: secondHabitId,
        name: 'Estudar Bona',
        createdAt: new Date('2023-01-16T03:00:00.000Z'),
        schedule: SCHEDULE.ALL_DAY,
        weekDays: {
          create: [
            { week_day: 0 },
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
            { week_day: 6 },
          ]
        }
      }
    }),
    prisma.habit.create({
      data: {
        // id: thirdHabitId,
        name: 'Praticar cello',
        createdAt: dateToMidnightISODate(new Date()),
        schedule: SCHEDULE.NIGHT,
        weekDays: {
          create: [
            { week_day: 0 },
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
            { week_day: 6 },
          ]
        }
      }
    })
  ]);

  // await Promise.all([
  //   prisma.day.create({
  //     data: {
  //       date: new Date('2023-01-17T03:00:00.000Z'),
  //       dayHabits: {
  //         create: {
  //           habit_id: firstHabitId
  //         }
  //       }
  //     }
  //   }),
  //   prisma.day.create({
  //     data: {
  //       date: new Date('2023-01-20T03:00:00.000Z'),
  //       dayHabits: {
  //         create: [
  //           { habit_id: firstHabitId },
  //           { habit_id: secondHabitId }
  //         ]
  //       }
  //     }
  //   }),
  // ]);

  await Promise.all([
    prisma.task.create({
      data: {
        name: 'Limpar geladeira',
        target_date: dateToMidnightISODate(addDays(new Date(), 2)),
        priority: 1,
        createdAt: dateToMidnightISODate(new Date()),
        isCompleted: false,
      }
    }),
    prisma.task.create({
      data: {
        name: 'Carpir o fundo',
        target_date: dateToMidnightISODate(addDays(new Date(), 1)),
        priority: 1,
        createdAt: dateToMidnightISODate(new Date()),
        isCompleted: false,
      }
    }),
    prisma.task.create({
      data: {
        name: 'Separar roupa para parto',
        target_date: dateToMidnightISODate(addDays(new Date(), 1)),
        priority: 0,
        createdAt: dateToMidnightISODate(new Date()),
        isCompleted: false,
      }
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })