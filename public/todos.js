(function() {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const empty = document.getElementById('todo-empty');

  function renderTodo(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('button');
    checkbox.className = 'todo-toggle';
    checkbox.setAttribute('aria-label', todo.completed ? 'Mark incomplete' : 'Mark complete');
    checkbox.innerHTML = todo.completed ? '&#10003;' : '';
    checkbox.addEventListener('click', function() { toggleTodo(todo.id, !todo.completed); });

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const del = document.createElement('button');
    del.className = 'todo-delete';
    del.setAttribute('aria-label', 'Delete todo');
    del.textContent = 'Delete';
    del.addEventListener('click', function() { deleteTodo(todo.id); });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(del);
    return li;
  }

  function updateList(todos) {
    list.innerHTML = '';
    if (todos.length === 0) {
      empty.style.display = '';
    } else {
      empty.style.display = 'none';
      todos.forEach(function(todo) {
        list.appendChild(renderTodo(todo));
      });
    }
  }

  function loadTodos() {
    fetch('/api/todos')
      .then(function(r) { return r.json(); })
      .then(updateList);
  }

  function addTodo(text) {
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    })
      .then(function(r) { return r.json(); })
      .then(function() { loadTodos(); });
  }

  function toggleTodo(id, completed) {
    fetch('/api/todos/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: completed })
    })
      .then(function() { loadTodos(); });
  }

  function deleteTodo(id) {
    fetch('/api/todos/' + id, { method: 'DELETE' })
      .then(function() { loadTodos(); });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var text = input.value.trim();
    if (text) {
      addTodo(text);
      input.value = '';
    }
  });

  loadTodos();
})();
