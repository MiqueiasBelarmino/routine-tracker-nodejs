export function addDays(date: Date, days: number): Date{
    var date = new Date(date.valueOf());
    date.setDate(date.getDate() + days);
    return new Date(date.setHours(0,0,0,0));
};

export function dateToMidnightISODate(date: Date): Date{
    var date = new Date(date.valueOf());
    return new Date(`${date.toISOString().split('T')[0]}T00:00:00.000Z`);
}