import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.routes.js';
import cors from 'cors';
import {app, server} from './lib/socket.js'
import path from 'path';

// const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials: true,
}));

const PORT=process.env.PORT;

app.use('/api/auth',authRoutes) 
app.use('/api/messages',messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res) =>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

server.listen(PORT, ()=>{
    console.log(`Server is Running in port ${PORT}`);
    connectDB();
})