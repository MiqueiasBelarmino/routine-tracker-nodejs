# Routine Tracker REST API

<strong>This API is under construction, I will be updating this information anytime.</strong>

The purpose of this API is to track daily habits and tasks. I built it to solve my routine gaps.
It allows us to track habits and their occurrences, and tasks to a specific date.

Habits examples:
1. (Mon to Fri) Take a 10-15 minute walk in the afternoon.
2. (every day) Read for 30 minutes before bed.
3. (Sat, Fri) Do a load of laundry.
4. (every day) Wash the dishes.
5. (every day) Take out the trash.
6. (every day) Make your bed in the morning.
 
Tasks examples:
1. Pay your bills for the month.
2. Hang out with a friend.
3. Medical appointment.
4. Plan a vacation

## Install & Run

    clone repo
    npm install
    create .env file based in .env.exemple from root dir
    set DATABASE_URL in .env file
    set prisma database provider in /prisma/schema.prisma (postgresql, mysql, sqlserver, sqlite, cockroachdb or mongodb)
    npx prisma migrate dev
    npx prisma db seed
    npm run dev
    
## Languages and Tools
- Node.js
- Typescript
- Express.js
- Prisma ORM
- Zod (Schema Validation)
- Swagger

# Endpoints

| Type | Endpoint | Description | Finished | 
| ---- | ---- | --------------- | ---------|
| GET | /docs | swagger documentation | ✅ |
| GET | /habits | get all habits | ✅ |
| POST | /habits | create a habit | ✅ |
| GET | /habit/{id} | get a specific habit | ✅ |
| PUT | /habit/{id} | update a habit | ✅ |
| DELETE | /habit/{id} | delete a specific habit | ✅ | |
| PATCH | /habit/{id}/toggle | change status to completed/uncompleted | ✅ |
| POST | /day | get all habits by day | ✅ |
| GET | /summary | get stats from all habits (qty available, qty completed) | ✅ |
| GET | /habits | get all tasks | ✅ |
| POST | /habits | create a task | ✅ |
| GET | /tasks/{id} | get a specific task | ✅ |
| PUT | /tasks/{id} | update a task | ✅ |
| DELETE | /tasks/{id} | delete a specific task | ✅ |
| PATCH | /tasks/{id}/toggle | change status to completed/uncompleted | ✅ |
| POST | /day | get all tasks by day |
| GET | /summary | get stats from all tasks (qty available, qty completed) |
