const express = require('express');
const path = require('path');
const { marked } = require('marked');
const { getAllPosts, getPostBySlug, getPostsByCategory, getAllCategories } = require('./data/posts');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Homepage - list all posts
app.get('/', (req, res) => {
  const posts = getAllPosts();
  const categories = getAllCategories();
  res.render('home', { posts, categories, currentCategory: null });
});

// Category filter
app.get('/category/:name', (req, res) => {
  const categoryName = req.params.name;
  const categories = getAllCategories();
  if (!categories.includes(categoryName)) {
    return res.status(404).render('404', { categories });
  }
  const posts = getPostsByCategory(categoryName);
  res.render('home', { posts, categories, currentCategory: categoryName });
});

// Individual post
app.get('/post/:slug', (req, res) => {
  const post = getPostBySlug(req.params.slug);
  const categories = getAllCategories();
  if (!post) {
    return res.status(404).render('404', { categories });
  }
  const contentHtml = marked(post.content);
  res.render('post', { post, contentHtml, categories });
});

// 404 handler
app.use((req, res) => {
  const categories = getAllCategories();
  res.status(404).render('404', { categories });
});

app.listen(PORT, () => {
  console.log(`Blog running at http://localhost:${PORT}`);
});

module.exports = app;
