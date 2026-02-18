require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')

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
app.use('/api/blogs', blogsRouter)

module.exports = app