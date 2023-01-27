import express from "express";
import cors from "cors";
import habitsRouter from "./routes/habitRoutes";

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/api/v1', habitsRouter);

app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`) }
);