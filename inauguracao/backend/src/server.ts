import express, {Request, Response, NextFunction} from 'express'
import 'express-async-errors'
import cors from 'cors';
import {rotas} from './routes'
import 'dotenv/config';

const app = express()
const porta = process.env.PORT || 4000
const corsOptions = {
    origin: ['https://node-y4wr.vercel.app'], // Remova a barra final
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(rotas)

app.listen(porta, ()=>{console.log('Servidor Online')})