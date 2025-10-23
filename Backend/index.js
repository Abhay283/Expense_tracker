import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect.js";
import express from "express";
import cors from "cors";
const app = express();
import mainRouter from "./routes/user.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use("/api/v1", mainRouter);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/expenses", categoryRoutes);
const port = process.env.PORT || 3000;

const start = async () => {

    try {
        await connectDB(process.env.MONGO_URI);
        console.log(" MongoDB Connected");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });

    } catch (error) {
        console.log(error);
    }
};

start();