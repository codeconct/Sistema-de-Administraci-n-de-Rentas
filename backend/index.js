import express, { request } from "express";
import { PORT } from "./config.js"
import apartmentsRouter from './routes/aparments.routes.js';

const app = express();

app.use(express.json());

app.use('/api', apartmentsRouter);

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);
