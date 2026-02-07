const posts = [
  {
    id: 1,
    slug: "getting-started-with-node",
    title: "Getting Started with Node.js",
    date: "2026-01-15",
    categories: ["Technology", "Tutorials"],
    excerpt: "A beginner-friendly guide to setting up your first Node.js project and understanding the basics of server-side JavaScript.",
    content: `
Node.js has transformed the way we build web applications. If you're coming from a front-end background, the transition to server-side JavaScript feels natural and rewarding.

## Why Node.js?

Node.js uses the V8 JavaScript engine, the same engine that powers Google Chrome. This means you can use the same language on both the client and the server, reducing context switching and enabling code sharing between environments.

Some key advantages:

- **Non-blocking I/O**: Node.js handles concurrent operations efficiently using an event-driven architecture.
- **NPM ecosystem**: Access to over a million open-source packages.
- **Active community**: Extensive documentation, tutorials, and community support.

## Setting Up

First, install Node.js from the official website or use a version manager like nvm:

\`\`\`bash
nvm install --lts
nvm use --lts
\`\`\`

Verify your installation:

\`\`\`bash
node --version
npm --version
\`\`\`

## Your First Server

Create a file called \`server.js\`:

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

Run it with \`node server.js\` and visit \`http://localhost:3000\`. You've just built your first Node.js server.

## Next Steps

From here, you might want to explore Express.js for building web applications, or dive into the built-in modules like \`fs\` for file system operations and \`path\` for working with file paths.

The Node.js ecosystem is vast and welcoming. Happy coding!
    `.trim()
  },
  {
    id: 2,
    slug: "perfect-sourdough-bread",
    title: "The Art of Perfect Sourdough Bread",
    date: "2026-01-22",
    categories: ["Food", "Lifestyle"],
    excerpt: "After years of trial and error, here's my reliable method for baking sourdough bread with a crispy crust and open crumb.",
    content: `
Sourdough bread is one of those pursuits that seems simple on the surface — flour, water, salt, and time — but reveals endless depth the deeper you go.

## The Starter

Everything begins with your starter. A healthy, active sourdough starter is the foundation of great bread. Feed it equal parts flour and water by weight, and keep it at room temperature if you bake frequently, or in the fridge if you bake weekly.

Signs of a healthy starter:
- Doubles in size within 4-6 hours after feeding
- Has a pleasant, tangy aroma
- Lots of bubbles on the surface and throughout

## My Go-To Recipe

This makes one loaf:

| Ingredient | Amount |
|-----------|--------|
| Bread flour | 450g |
| Water | 325g |
| Sourdough starter | 90g |
| Salt | 9g |

## The Method

**Morning (9 AM)**: Mix flour and water, let it rest for 30 minutes (autolyse). This hydrates the flour and begins gluten development without any kneading.

**9:30 AM**: Add starter and salt. Mix until incorporated. The dough will feel shaggy — that's normal.

**10 AM - 2 PM**: Perform stretch and folds every 30 minutes for the first 2 hours, then let it rest. You should see the dough become smoother, more elastic, and start to hold its shape.

**2 PM**: Shape the dough and place it in a floured banneton basket. Cover and refrigerate overnight.

**Next morning**: Preheat your oven to 500°F with a Dutch oven inside. Score the cold dough, place it in the Dutch oven, and bake covered for 20 minutes. Remove the lid and bake for another 20-25 minutes until deeply golden.

## The Wait

This is the hardest part: let the bread cool for at least an hour before cutting. The interior is still cooking from residual heat, and cutting too early will result in a gummy texture.

The reward is worth the patience — a crackling crust, an open and airy crumb, and that unmistakable sourdough tang.
    `.trim()
  },
  {
    id: 3,
    slug: "minimalist-workspace",
    title: "Designing a Minimalist Workspace",
    date: "2026-02-01",
    categories: ["Lifestyle", "Design"],
    excerpt: "How I transformed my cluttered home office into a calm, focused workspace with just the essentials.",
    content: `
Last year, I looked at my desk and realized it had become a graveyard of half-finished projects, tangled cables, and sticky notes I'd never read again. Something had to change.

## The Problem with Clutter

Research consistently shows that visual clutter competes for our attention, reduces working memory, and increases stress. A messy workspace doesn't just look bad — it actively hinders our ability to focus and think clearly.

## My Approach

I didn't go full Marie Kondo overnight. Instead, I followed a gradual process:

### 1. The Audit

I took everything off my desk and out of my drawers. Everything. Then I sorted items into three piles:
- **Daily essentials**: Things I use every single day
- **Weekly needs**: Things I use at least once a week
- **Archive**: Everything else

### 2. The Desk

My daily essentials turned out to be surprisingly few:
- Laptop and monitor
- Keyboard and mouse
- A notebook and pen
- A water bottle

That's it. Everything else went into a drawer or was removed entirely.

### 3. Cable Management

I ran all cables through a single cable tray mounted under the desk. One power strip lives in the tray, and a single cable runs to the wall outlet. The visual difference is dramatic.

### 4. The Digital Cleanup

A minimalist physical workspace loses its effect if your digital workspace is chaotic. I:
- Cleared my desktop of all files
- Uninstalled apps I hadn't used in 3 months
- Set up a simple folder structure: Inbox, Active, Archive

## What Changed

The impact was immediate. I sit down, and there's nothing competing for my attention except the work in front of me. My mind feels clearer. I'm more productive. And perhaps surprisingly, I'm more creative — constraints breed creativity.

## Tips for Getting Started

- **Start small**: Clear just your desk surface first
- **One in, one out**: For every new item, remove an existing one
- **Weekly reset**: Spend 10 minutes every Friday returning things to their place
- **Give it time**: It takes about two weeks for a new environment to feel normal

Minimalism isn't about having less for its own sake. It's about making room for what matters.
    `.trim()
  },
  {
    id: 4,
    slug: "understanding-css-grid",
    title: "Understanding CSS Grid Layout",
    date: "2026-02-05",
    categories: ["Technology", "Design"],
    excerpt: "CSS Grid is the most powerful layout system in CSS. Here's a practical guide to using it effectively in your projects.",
    content: `
CSS Grid Layout is a two-dimensional layout system that lets you control both rows and columns simultaneously. If you've been relying solely on Flexbox, Grid will open up new possibilities.

## Grid vs Flexbox

Flexbox is one-dimensional — it handles either a row or a column. Grid is two-dimensional — it handles rows AND columns at the same time. They're complementary tools:

- **Flexbox**: Navigation bars, card rows, centering content
- **Grid**: Page layouts, image galleries, dashboard layouts

## Basic Setup

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

This creates a three-column grid where each column takes equal space, with 1rem of space between items.

## Responsive Without Media Queries

One of Grid's superpowers is creating responsive layouts without media queries:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\`

This creates as many columns as will fit, each at least 300px wide. Items automatically wrap to new rows as the viewport shrinks.

## Named Grid Areas

For page layouts, named grid areas are incredibly readable:

\`\`\`css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

You can literally see the layout in the code. Want to change it for mobile? Just redefine the grid-template-areas in a media query.

## Practical Tips

- Use \`fr\` units instead of percentages — they account for gaps automatically
- Use \`minmax()\` for flexible but bounded sizing
- Combine Grid for the overall layout with Flexbox for component-level alignment
- Use browser DevTools grid inspector to visualize your grid lines

CSS Grid has excellent browser support now. If you're still using float-based layouts, it's time to make the switch.
    `.trim()
  }
];

function getAllPosts() {
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug);
}

function getPostsByCategory(category) {
  return posts
    .filter(p => p.categories.includes(category))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getAllCategories() {
  const cats = new Set();
  for (const post of posts) {
    for (const cat of post.categories) {
      cats.add(cat);
    }
  }
  return Array.from(cats).sort();
}

module.exports = { getAllPosts, getPostBySlug, getPostsByCategory, getAllCategories };
