import dotenv from "dotenv";
// import "express-async-errors"
dotenv.config();

import connectDB from "./db/connect.js";
import express from "express";
import cors from "cors";
const app = express();
import mainRouter from "./routes/user.js";

app.use(express.json());

app.use(cors())
app.use("/api/v1", mainRouter);

const port = process.env.PORT || 3000;

const start = async () => {

    try {        
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })

    } catch (error) {
       console.log(error); 
    }
}

start();