import express from "express";
import cors from "cors";
import habitsRouter from "./routes/habitRoutes";
import taskRouter from "./routes/taskRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from './swagger.json';
import usersRouter from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use('/api/v1', habitsRouter);
app.use('/api/v1', taskRouter);
app.use('/api/v1', usersRouter);

app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`) }
);