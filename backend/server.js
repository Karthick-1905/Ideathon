require('dotenv').config();
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const morgan = require("morgan")

const routesRouter = require('./routes/routeRouter')
const authRouter =  require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const authProvider = require('./middlewares/authMiddlware')
const errorHandler = require('./middlewares/errorHandler')

const app = express();

const {PORT,NODE_ENV,MONGO_URI} = process.env

if(NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/routes",routesRouter)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",authProvider,userRouter)
app.use(errorHandler);

const start = async() =>{
    try{
        const db =  await mongoose.connect(MONGO_URI)
        console.log(`MongoDB Connected:${db.connection.host}`)
        app.listen(PORT,()=>{
            console.log(`The Server is running at ${PORT}`)
        })
    }
    catch(error){
        console.log(error)
    }
}

start()