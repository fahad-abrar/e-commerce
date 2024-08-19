import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import databaseConnection from "./database/databse.js";
import router from './router/route.js'
import errMiddlewere from './erroorhandler/errMiddlewere.js'


dotenv.config({
    path:'./config/config.env'
})

const app = express()
const PORT = process.env.PORT || 3000

//middlewere
app.use(cors({
    origin:'http://localhost:4001',
    methods:['GET','POST','PUT','DELETE'],
    credentials: true
    })
)
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(express.static('public'))

// router 
app.use('/api', router)


// database connection
databaseConnection()

// error handler
app.use(errMiddlewere)

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})