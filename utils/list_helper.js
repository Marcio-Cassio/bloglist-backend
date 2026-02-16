const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let topAuthor = null
  let topCount = -1

  for (const author of Object.keys(counts)) {
    if (counts[author] > topCount) {
      topAuthor = author
      topCount = counts[author]
    }
  }

  return {
    author: topAuthor,
    blogs: topCount,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  let topAuthor = null
  let topLikes = -1

  for (const author of Object.keys(likesByAuthor)) {
    if (likesByAuthor[author] > topLikes) {
      topAuthor = author
      topLikes = likesByAuthor[author]
    }
  }

  return {
    author: topAuthor,
    likes: topLikes,
  }
}

module.exports = { 
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}