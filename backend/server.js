require('dotenv').config();
const express = require('express')
const routesRouter = require('./routes/routeRouter')
const morgan = require("morgan")
const app = express();

const {PORT,NODE_ENV} = process.env

if(NODE_ENV === 'development'){
    app.use(morgan('dev'))
}



app.use(express.json())

app.use("/api/v1/routes",routesRouter)
const start = () =>{
 app.listen(PORT,()=>{
    console.log(`You are Listening on https://localhost:${PORT}`)
 })
}

start()