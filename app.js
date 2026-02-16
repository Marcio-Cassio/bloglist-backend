require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app