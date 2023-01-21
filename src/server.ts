import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from '@prisma/client';
import { dateToMidnightISODate } from "../util";

const app = fastify();
const prisma = new PrismaClient();

app.register(cors);

app.get('/', () => {
    return dateToMidnightISODate(new Date())
})

app.get('/habits', async () => {
    const habits = await prisma.habit.findMany();
    return habits;
})

app.listen({port: 3333}).then(() => { console.log('Server running') })