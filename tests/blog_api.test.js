const { test, describe, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

before(async () => {
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve)
      mongoose.connection.once('error', reject)
    })
  }
})

const initialBlogs = [
  {
    title: 'first blog',
    author: 'Tester one',
    url: 'http://example.com/1',
    likes: 7,
  },
  {
    title: 'Second blog',
    author: 'Tester Two',
    url: 'http://example.com/2',
    likes: 5,
  },
]

describe('when there are initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = await new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    }).save()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = loginResponse.body.token
    assert.ok(token)

    const blogsWithUser = initialBlogs.map((blog) => ({
      ...blog,
      user: user._id,
    }))

    await Blog.insertMany(blogsWithUser)
  })

  test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'No Token',
      url: 'http://example.com/notoken',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'A new blog',
      author: 'New Author',
      url: 'http://example.com/new',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const titles = response.body.map((b) => b.title)
    assert(titles.includes('A new blog'))
  })

  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'No likes field',
      author: 'Likes Default',
      url: 'http://example.com/nolikes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added and returns 400', async () => {
    const newBlog = {
      author: 'No Title',
      url: 'http://example.com/notitle',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blog without url is not added and returns 400', async () => {
    const newBlog = {
      title: 'No url',
      author: 'No url',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

    const titles = blogsAtEnd.body.map((b) => b.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })

  test('deleting a blog fails with 403 if user is not the creator', async () => {
    await api
      .post('/api/users')
      .send({ username: 'other', name: 'Other User', password: 'sekret2' })
      .expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'other', password: 'sekret2' })
      .expect(200)

    const otherToken = loginResponse.body.token

    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)
  })
})

after(async () => {
  await mongoose.connection.close()
})