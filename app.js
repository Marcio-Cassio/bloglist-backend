require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

const mongoUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUrl)
    console.log('connected to MongoDB, db =', mongoose.connection.name)
  } catch (error) {
    console.log('error connecting to MongoDB:', error.message)
  }
}

connectToMongo()

app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app