import express from "express";
import cors from "cors";
import habitsRouter from "./routes/habitRoutes";
import taskRouter from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/api/v1', habitsRouter);
app.use('/api/v1', taskRouter);

app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`) }
);