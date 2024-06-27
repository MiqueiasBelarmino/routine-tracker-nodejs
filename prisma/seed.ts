import { hash } from 'bcryptjs';
import { PrismaClientCon as prisma } from '../src/lib/prisma';
import { SCHEDULE } from '../src/utils/consts';
import { addDays, dateToMidnightISODate } from '../src/utils/helpers';

async function main() {

  const ENV = process.env.APP_ENV || "development";

  switch (ENV) {
    case "production": {
      const userAlreadyExists = await prisma.user.findUnique({
        where: {
          username: "mbelarmino"
        }
      })

      if(!userAlreadyExists){
        await Promise.all([
          prisma.user.create({
            data: {
              name: 'Miquéias Belarmino',
              password: await hash("mbelarmino", 10),
              username: "mbelarmino",
              createdAt: dateToMidnightISODate(new Date()),
            }
          }),
        ]);
      }
      break;
    }
    case "development": {
      await prisma.refreshToken.deleteMany();
      await prisma.habitWeekDay.deleteMany();
      await prisma.dayHabit.deleteMany();
      await prisma.day.deleteMany();
      await prisma.habit.deleteMany();
      await prisma.task.deleteMany();
      await prisma.user.deleteMany();

      const firstHabitId = '068ba380-decb-496d-b762-58fefea6569c';
      const secondHabitId = '2357c721-5479-4c6d-9c2f-1dae308fa89d';
      const thirdHabitId = '704f8036-8563-4208-9150-22d14f48d252';
      const testUserId = "6ff9b197-19c2-4d9a-8067-fa57191c7eb8";

      const passwordHash = await hash("testuser", 10);

      await Promise.all([
        prisma.user.create({
          data: {
            id: testUserId,
            name: 'Test User',
            password: passwordHash,
            username: "testuser",
            createdAt: new Date('2023-01-15T00:00:00.000Z'),
          }
        }),
      ]);

      await Promise.all([
        prisma.habit.create({
          data: {
            id: firstHabitId,
            userId: testUserId,
            name: 'Take a 10-15 minute walk in the afternoon',
            createdAt: new Date('2023-01-15T00:00:00.000Z'),
            schedule: SCHEDULE.MONING,
            weekDays: {
              create: [
                { weekDay: 1 },
                { weekDay: 2 },
                { weekDay: 3 },
                { weekDay: 4 },
                { weekDay: 5 },
              ]
            }
          }
        }),
        prisma.habit.create({
          data: {
            id: secondHabitId,
            userId: testUserId,
            name: 'Read for 30 minutes before bed',
            createdAt: new Date('2023-01-16T00:00:00.000Z'),
            schedule: SCHEDULE.NIGHT,
            weekDays: {
              create: [
                { weekDay: 0 },
                { weekDay: 1 },
                { weekDay: 2 },
                { weekDay: 3 },
                { weekDay: 4 },
                { weekDay: 5 },
                { weekDay: 6 },
              ]
            }
          }
        }),
        prisma.habit.create({
          data: {
            id: thirdHabitId,
            userId: testUserId,
            name: 'Take out the trash',
            createdAt: dateToMidnightISODate(new Date()),
            schedule: SCHEDULE.NIGHT,
            weekDays: {
              create: [
                { weekDay: 0 },
                { weekDay: 2 },
                { weekDay: 4 },
              ]
            }
          }
        }),
        prisma.habit.create({
          data: {
            userId: testUserId,
            name: 'Make your bed in the morning',
            createdAt: new Date('2023-01-15T00:00:00.000Z'),
            schedule: SCHEDULE.MONING,
            weekDays: {
              create: [
                { weekDay: 0 },
                { weekDay: 1 },
                { weekDay: 2 },
                { weekDay: 3 },
                { weekDay: 4 },
                { weekDay: 5 },
                { weekDay: 6 },
              ]
            }
          }
        }),
        prisma.habit.create({
          data: {
            userId: testUserId,
            name: 'Do a load of laundry',
            createdAt: new Date('2023-01-15T00:00:00.000Z'),
            schedule: SCHEDULE.MONING,
            weekDays: {
              create: [
                { weekDay: 5 },
                { weekDay: 6 },
              ]
            }
          }
        }),
        prisma.habit.create({
          data: {
            userId: testUserId,
            name: 'Cello practice',
            createdAt: new Date('2023-01-15T00:00:00.000Z'),
            schedule: SCHEDULE.MONING,
            weekDays: {
              create: [
                { weekDay: 0 },
                { weekDay: 1 },
                { weekDay: 2 },
                { weekDay: 3 },
                { weekDay: 4 },
                { weekDay: 5 },
                { weekDay: 6 },
              ]
            }
          }
        })
      ]);

      await Promise.all([
        prisma.day.create({
          data: {
            date: new Date('2023-01-17T00:00:00.000Z'),
            dayHabits: {
              create: {
                habitId: firstHabitId,
                userId: testUserId,
              }
            }
          }
        }),
        prisma.day.create({
          data: {
            date: new Date('2023-01-20T00:00:00.000Z'),
            dayHabits: {
              create: [
                { habitId: firstHabitId, userId: testUserId, },
                { habitId: secondHabitId, userId: testUserId, }
              ]
            }
          }
        }),
      ]);

      await Promise.all([
        prisma.task.create({
          data: {
            userId: testUserId,
            name: 'buy some flowers',
            targetDate: dateToMidnightISODate(addDays(new Date(), 2)),
            priority: 1,
            createdAt: dateToMidnightISODate(new Date()),
            isCompleted: false,
          }
        }),
        prisma.task.create({
          data: {
            userId: testUserId,
            name: 'Prepare to restaurant',
            targetDate: dateToMidnightISODate(addDays(new Date(), 1)),
            priority: 1,
            createdAt: dateToMidnightISODate(new Date()),
            isCompleted: false,
          }
        }),
        prisma.task.create({
          data: {
            userId: testUserId,
            name: 'Schedule XPTO call',
            targetDate: dateToMidnightISODate(addDays(new Date(), 1)),
            priority: 0,
            createdAt: dateToMidnightISODate(new Date()),
            isCompleted: false,
          }
        }),
      ]);

      break;
    }
  }

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