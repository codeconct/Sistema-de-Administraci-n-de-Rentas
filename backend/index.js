import { PORT } from "./config.js"
import express from 'express';
import cors from 'cors';

// Routers
import ownersRouter from './routes/owners.routes.js';
import tenantsRouter from './routes/tenants.routes.js';
import guarantorsRouter from './routes/guarantors.routes.js';
import apartmentsRouter from './routes/aparments.routes.js';
import rentalContractsRouter from './routes/rentalContracts.routes.js';
import invoicesRouter from './routes/invoices.routes.js';
import paymentsRouter from './routes/payments.routes.js';
import documentsRouter from './routes/documents.routes.js';
import maintenanceRequestsRouter from './routes/maintenanceRequests.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', ownersRouter);
app.use('/api', tenantsRouter);
app.use('/api', guarantorsRouter);
app.use('/api', apartmentsRouter);
app.use('/api', rentalContractsRouter);
app.use('/api', invoicesRouter);
app.use('/api', paymentsRouter);
app.use('/api', documentsRouter);
app.use('/api', maintenanceRequestsRouter);

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);
