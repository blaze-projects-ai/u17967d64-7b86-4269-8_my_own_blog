const http = require('http');
const assert = require('assert');

const app = require('./server');

let server;
const PORT = 0; // Let OS assign a port

function request(path) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${server.address().port}${path}`;
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
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

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  if (server) server.close();
  process.exit(1);
});
