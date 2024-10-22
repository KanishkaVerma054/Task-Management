require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const { userRouter } = require('./routes/user')
const { taskRouter } = require('./routes/taskRouter')
const { authMiddleware } = require('./middleware/auth')


const app = express()

app.use(express.json())

app.use("/api/v1/user", userRouter)
app.use("/app/v1/tasks", authMiddleware, taskRouter)


mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected!'));
app.listen(3000)

