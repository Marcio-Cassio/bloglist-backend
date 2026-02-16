const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('mostBlogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('returns the author with the highest number of blogs', () => {
    const blogs = [
      { title: 'A', author: 'Robert C. Martin', url: 'x', likes: 5 },
      { title: 'B', author: 'Robert C. Martin', url: 'x', likes: 2 },
      { title: 'C', author: 'Edsger W. Dijkstra', url: 'x', likes: 1 },
      { title: 'D', author: 'Robert C. Martin', url: 'x', likes: 0 },
      { title: 'E', author: 'Edsger W. Dijkstra', url: 'x', likes: 7 },
    ]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})