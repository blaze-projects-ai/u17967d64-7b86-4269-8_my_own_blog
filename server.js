const express = require('express');
const path = require('path');
const { marked } = require('marked');
const { getAllPosts, getPostBySlug, getPostsByCategory, getAllCategories } = require('./data/posts');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory todo store
let todos = [];
let nextId = 1;

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

// Todo page
app.get('/todos', (req, res) => {
  const categories = getAllCategories();
  res.render('todos', { categories });
});

// Todo API
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const todo = { id: nextId++, text: text.trim(), completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  if (typeof req.body.completed === 'boolean') {
    todo.completed = req.body.completed;
  }
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos.splice(index, 1);
  res.status(204).end();
});

// Reset todos (for testing)
app._resetTodos = function() {
  todos = [];
  nextId = 1;
};

// 404 handler
app.use((req, res) => {
  const categories = getAllCategories();
  res.status(404).render('404', { categories });
});

app.listen(PORT, () => {
  console.log(`Blog running at http://localhost:${PORT}`);
});

module.exports = app;
