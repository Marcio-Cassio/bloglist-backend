const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('favoriteBlog', () => {
  test('of empty list is null', () => {
    const blogs = []
    assert.strictEqual(listHelper.favoriteBlog(blogs), null)
  })

  test('when list has one blog returns that blog', () => {
    const blogs = [
      { title: 'One', author: 'A', url: 'http://1', likes: 7 },
    ]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
  })

  test('of a bigger list returns the one with most likes', () => {
    const blogs = [
      { title: 'A', author: 'X', url: 'http://a', likes: 5 },
      { title: 'B', author: 'Y', url: 'http://b', likes: 10 },
      { title: 'C', author: 'Z', url: 'http://c', likes: 1 },
    ]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
  })
})