import express from 'express';
import cors from 'cors';
import 'dotenv/config'

import { RutasModelo } from './routes/model.route.js';
import { redisOptions } from './routes/formulario.route.js';
import { locationRouter } from './routes/locations.route.js';


const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT;

/* Routes */
app.use('/api/model', RutasModelo);
app.use('/api/redis', redisOptions);
app.use('/api/location', locationRouter);

app.listen(PORT, () => {
    console.log('Escuchando en el puerto:', PORT)
})