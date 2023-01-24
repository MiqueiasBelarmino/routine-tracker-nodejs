import { PrismaClientCon as prisma } from '../src/lib/prisma';
import { addDays, dateToMidnightISODate } from '../util';

async function main() {

  await prisma.habitWeekDay.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.task.deleteMany();

  await Promise.all([
    prisma.habit.create({
      data: {
        name: 'Acordar cedo',
        createdAt: dateToMidnightISODate(new Date()),
        isCompleted: false,
        schedule: 'm',
        weekDays: {
          create: [
            { week_day: 1},
            { week_day: 2},
            { week_day: 3},
            { week_day: 4},
            { week_day: 5},
          ]
        }
      }
    }),
    prisma.habit.create({
      data: {
        name: 'Estudar Bona',
        createdAt: dateToMidnightISODate(new Date()),
        isCompleted: false,
        schedule: 'D',
        weekDays: {
          create: [
            { week_day: 0},
            { week_day: 1},
            { week_day: 2},
            { week_day: 3},
            { week_day: 4},
            { week_day: 5},
            { week_day: 6},
          ]
        }
      }
    }),
    prisma.habit.create({
      data: {
        name: 'Praticar cello',
        createdAt: dateToMidnightISODate(new Date()),
        isCompleted: false,
        schedule: 'N',
        weekDays: {
          create: [
            { week_day: 0},
            { week_day: 1},
            { week_day: 2},
            { week_day: 3},
            { week_day: 4},
            { week_day: 5},
            { week_day: 6},
          ]
        }
      }
    })
  ]);

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