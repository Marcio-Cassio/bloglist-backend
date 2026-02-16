const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('totalLikes', () => {
  test('of empty list is zero', () => {
    const blogs = []
    assert.strictEqual(listHelper.totalLikes(blogs), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [
      {
        title: 'one',
        author: 'Author',
        url: 'http://example.com',
        likes: 7,
      },
    ]
        
    assert.strictEqual(listHelper.totalLikes(blogs), 7)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'A', author: 'X', url: 'http://a', likes: 5 },
      { title: 'B', author: 'Y', url: 'http://b', likes: 10 },
      { title: 'C', author: 'Z', url: 'http://c', likes: 1 },
    ]

    assert.strictEqual(listHelper.totalLikes(blogs), 16)
  })
})