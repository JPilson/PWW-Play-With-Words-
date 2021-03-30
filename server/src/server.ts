import express, {Application,Request,Response} from 'express';
import {application} from "express";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const PORT = process.env.PORT

const app:Application = express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))


app.post("/",(request: Request, response: Response)=>{
    response
        .type("text/plain")
        .send("Hi")
});
app.get("/",(request: Request, response: Response)=>{
    response
        .type("text/plain")
        .send("Hi")
});

app.listen(PORT,()=> console.log(`API http://localhost:${PORT}`))
