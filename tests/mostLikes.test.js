const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('mostLikes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('returns the author whose blogs have the most total likes', () => {
    const blogs = [
      { title: 'A', author: 'Robert C. Martin', url: 'x', likes: 5 },
      { title: 'B', author: 'Robert C. Martin', url: 'x', likes: 2 },
      { title: 'C', author: 'Edsger W. Dijkstra', url: 'x', likes: 1 },
      { title: 'D', author: 'Robert C. Martin', url: 'x', likes: 0 },
      { title: 'E', author: 'Edsger W. Dijkstra', url: 'x', likes: 7 },
    ]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 8,
    })
  })
})