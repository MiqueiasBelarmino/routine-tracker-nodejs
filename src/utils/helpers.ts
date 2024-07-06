import { sign } from "jsonwebtoken";

export function addDays(date: Date, days: number): Date {
    var date = new Date(date.valueOf());
    date.setDate(date.getDate() + days);
    return new Date(date.setHours(0, 0, 0, 0));
};

export function addHours(date: Date, hours: number): Date {
    var date = new Date(date.valueOf());
    date.setHours(new Date().getHours() + (hours));
    return date;
};

export function dateToMidnightISODate(date?: Date): Date {
    var parsedDate = new Date(date?.valueOf() || new Date());
    parsedDate = addHours(parsedDate, -(parsedDate.getTimezoneOffset() / 60));
    return new Date(`${parsedDate.toISOString().split('T')[0]}T00:00:00.000Z`);
}

export async function generateTokenJWT(userId: string) {
    const token = sign({}, process.env.JWT_KEY as string, {
        subject: userId,
        expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME  as string
    });

    return token;
}

