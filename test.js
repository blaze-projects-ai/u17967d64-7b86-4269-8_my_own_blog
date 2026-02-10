const http = require('http');
const assert = require('assert');

const app = require('./server');

let server;
const PORT = 0; // Let OS assign a port

function request(path, options) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:${server.address().port}${path}`);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: (options && options.method) || 'GET',
      headers: (options && options.headers) || {}
    };
    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (options && options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    return fn().then(() => {
      console.log(`  PASS: ${name}`);
      passed++;
    }).catch(err => {
      console.log(`  FAIL: ${name}`);
      console.log(`        ${err.message}`);
      failed++;
    });
  }

  // Start server on random port
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });

  console.log('Running tests...\n');

  await test('Homepage returns 200', async () => {
    const res = await request('/');
    assert.strictEqual(res.status, 200);
  });

  await test('Homepage contains blog posts', async () => {
    const res = await request('/');
    assert(res.body.includes('Getting Started with Node.js'), 'Missing Node.js post');
    assert(res.body.includes('The Art of Perfect Sourdough Bread'), 'Missing sourdough post');
    assert(res.body.includes('Designing a Minimalist Workspace'), 'Missing workspace post');
    assert(res.body.includes('Understanding CSS Grid Layout'), 'Missing CSS Grid post');
  });

  await test('Homepage contains category links', async () => {
    const res = await request('/');
    assert(res.body.includes('/category/Technology'), 'Missing Technology category link');
    assert(res.body.includes('/category/Lifestyle'), 'Missing Lifestyle category link');
  });

  await test('Individual post page returns 200', async () => {
    const res = await request('/post/getting-started-with-node');
    assert.strictEqual(res.status, 200);
  });

  await test('Post page contains full content', async () => {
    const res = await request('/post/getting-started-with-node');
    assert(res.body.includes('Getting Started with Node.js'), 'Missing title');
    assert(res.body.includes('V8 JavaScript engine'), 'Missing content');
  });

  await test('Post page renders markdown as HTML', async () => {
    const res = await request('/post/getting-started-with-node');
    assert(res.body.includes('<h2>'), 'Missing rendered h2 heading');
    assert(res.body.includes('<code>'), 'Missing rendered code');
  });

  await test('Category filter returns correct posts', async () => {
    const res = await request('/category/Technology');
    assert.strictEqual(res.status, 200);
    assert(res.body.includes('Getting Started with Node.js'), 'Missing Node.js post in Technology');
    assert(res.body.includes('Understanding CSS Grid Layout'), 'Missing CSS Grid post in Technology');
  });

  await test('Category filter excludes unrelated posts', async () => {
    const res = await request('/category/Food');
    assert.strictEqual(res.status, 200);
    assert(res.body.includes('The Art of Perfect Sourdough Bread'), 'Missing sourdough post in Food');
    assert(!res.body.includes('Getting Started with Node.js'), 'Node.js post should not be in Food');
  });

  await test('Nonexistent post returns 404', async () => {
    const res = await request('/post/nonexistent');
    assert.strictEqual(res.status, 404);
  });

  await test('Nonexistent category returns 404', async () => {
    const res = await request('/category/Nonexistent');
    assert.strictEqual(res.status, 404);
  });

  await test('Nonexistent route returns 404', async () => {
    const res = await request('/does-not-exist');
    assert.strictEqual(res.status, 404);
  });

  await test('Posts are ordered by date (newest first)', async () => {
    const res = await request('/');
    const cssGridPos = res.body.indexOf('Understanding CSS Grid Layout');
    const nodePos = res.body.indexOf('Getting Started with Node.js');
    assert(cssGridPos < nodePos, 'CSS Grid (Feb 5) should appear before Node.js (Jan 15)');
  });

  // Todo tests
  console.log('');

  // Reset todos before todo tests
  app._resetTodos();

  await test('Todo page returns 200', async () => {
    const res = await request('/todos');
    assert.strictEqual(res.status, 200);
  });

  await test('Todo page contains form elements', async () => {
    const res = await request('/todos');
    assert(res.body.includes('todo-form'), 'Missing todo form');
    assert(res.body.includes('todo-input'), 'Missing todo input');
    assert(res.body.includes('todo-list'), 'Missing todo list');
  });

  await test('GET /api/todos returns empty array initially', async () => {
    const res = await request('/api/todos');
    assert.strictEqual(res.status, 200);
    const todos = JSON.parse(res.body);
    assert(Array.isArray(todos), 'Should return an array');
    assert.strictEqual(todos.length, 0, 'Should be empty initially');
  });

  await test('POST /api/todos creates a todo', async () => {
    const res = await request('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Buy groceries' })
    });
    assert.strictEqual(res.status, 201);
    const todo = JSON.parse(res.body);
    assert.strictEqual(todo.text, 'Buy groceries');
    assert.strictEqual(todo.completed, false);
    assert(todo.id, 'Should have an id');
  });

  await test('POST /api/todos rejects empty text', async () => {
    const res = await request('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' })
    });
    assert.strictEqual(res.status, 400);
  });

  await test('GET /api/todos returns created todos', async () => {
    const res = await request('/api/todos');
    const todos = JSON.parse(res.body);
    assert.strictEqual(todos.length, 1);
    assert.strictEqual(todos[0].text, 'Buy groceries');
  });

  await test('PATCH /api/todos/:id toggles completion', async () => {
    const listRes = await request('/api/todos');
    const todos = JSON.parse(listRes.body);
    const id = todos[0].id;

    const res = await request(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    assert.strictEqual(res.status, 200);
    const updated = JSON.parse(res.body);
    assert.strictEqual(updated.completed, true);
  });

  await test('PATCH /api/todos/:id returns 404 for nonexistent', async () => {
    const res = await request('/api/todos/9999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    assert.strictEqual(res.status, 404);
  });

  await test('DELETE /api/todos/:id removes a todo', async () => {
    const listRes = await request('/api/todos');
    const todos = JSON.parse(listRes.body);
    const id = todos[0].id;

    const res = await request(`/api/todos/${id}`, { method: 'DELETE' });
    assert.strictEqual(res.status, 204);

    const afterRes = await request('/api/todos');
    const remaining = JSON.parse(afterRes.body);
    assert.strictEqual(remaining.length, 0, 'Todo should be deleted');
  });

  await test('DELETE /api/todos/:id returns 404 for nonexistent', async () => {
    const res = await request('/api/todos/9999', { method: 'DELETE' });
    assert.strictEqual(res.status, 404);
  });

  await test('Homepage nav contains Todos link', async () => {
    const res = await request('/');
    assert(res.body.includes('href="/todos"'), 'Missing Todos link in nav');
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  if (server) server.close();
  process.exit(1);
});
