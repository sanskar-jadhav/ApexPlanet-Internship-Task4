// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const visible = getComputedStyle(navLinks).display !== 'none';
    navLinks.style.display = visible ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.gap = '12px';
    navLinks.style.background = '#ffffff';
    navLinks.style.position = 'absolute';
    navLinks.style.right = '4%';
    navLinks.style.top = '56px';
    navLinks.style.padding = '12px';
    navLinks.style.border = '1px solid #e5e7eb';
    navLinks.style.borderRadius = '10px';
  });
}

/* =========================
   To‑Do List (localStorage)
   ========================= */
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearAll = document.getElementById('clearAll');
const TASKS_KEY = 'tasks:v1';

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  taskList.innerHTML = '';
  tasks.forEach((task, index) => renderTask(task, index));
}

function renderTask(task, index) {
  const li = document.createElement('li');

  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.alignItems = 'center';
  left.style.gap = '10px';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = !!task.done;

  const text = document.createElement('span');
  text.textContent = task.text;
  text.style.textDecoration = task.done ? 'line-through' : 'none';

  checkbox.addEventListener('change', () => toggleDone(index, checkbox.checked, text));

  left.appendChild(checkbox);
  left.appendChild(text);

  const del = document.createElement('button');
  del.textContent = 'Delete';
  del.className = 'btn-outline';
  del.addEventListener('click', () => removeTask(index));

  li.appendChild(left);
  li.appendChild(del);
  taskList.appendChild(li);
}

function getTasks() { return JSON.parse(localStorage.getItem(TASKS_KEY)) || []; }
function setTasks(tasks) { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }

function addTask() {
  const value = (taskInput?.value || '').trim();
  if (!value) return;
  const tasks = getTasks();
  tasks.push({ text: value, done: false, createdAt: Date.now() });
  setTasks(tasks);
  taskInput.value = '';
  loadTasks();
}

function removeTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  setTasks(tasks);
  loadTasks();
}

function toggleDone(index, done, labelEl) {
  const tasks = getTasks();
  if (!tasks[index]) return;
  tasks[index].done = done;
  setTasks(tasks);
  if (labelEl) labelEl.style.textDecoration = done ? 'line-through' : 'none';
}

addBtn?.addEventListener('click', addTask);
taskInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});
clearAll?.addEventListener('click', () => {
  if (confirm('Clear all tasks?')) {
    localStorage.removeItem(TASKS_KEY);
    loadTasks();
  }
});
loadTasks();

/* =========================================
   Product Listing (Filter + Sort + Render)
   ========================================= */
const products = [
  { name: 'Laptop Pro 14', category: 'electronics', price: 899, rating: 4.6 },
  { name: 'Noise‑Cancel Headphones', category: 'electronics', price: 129, rating: 4.4 },
  { name: 'Cotton T‑Shirt', category: 'clothing', price: 19, rating: 4.0 },
  { name: 'Denim Jacket', category: 'clothing', price: 59, rating: 4.3 },
  { name: 'JavaScript Handbook', category: 'books', price: 29, rating: 4.8 },
  { name: 'Mechanical Keyboard', category: 'electronics', price: 79, rating: 4.5 },
  { name: 'Running Shoes', category: 'clothing', price: 74, rating: 4.2 },
];

const productList = document.getElementById('productList');
const filterCategory = document.getElementById('filterCategory');
const filterPrice = document.getElementById('filterPrice');
const sortSelect = document.getElementById('sortSelect');
const applyFilters = document.getElementById('applyFilters');
const resetFilters = document.getElementById('resetFilters');

function renderProducts(list) {
  if (!productList) return;
  productList.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const top = document.createElement('div');
    top.style.display = 'flex';
    top.style.justifyContent = 'space-between';
    top.style.alignItems = 'center';

    const title = document.createElement('h3');
    title.textContent = p.name;

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = p.category;

    top.appendChild(title);
    top.appendChild(badge);

    const meta = document.createElement('div');
    meta.className = 'product-meta';
    meta.textContent = `Category: ${p.category}`;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `₹${p.price}`;

    const rating = document.createElement('div');
    rating.className = 'rating';
    rating.textContent = `★ ${p.rating}`;

    card.appendChild(top);
    card.appendChild(meta);
    card.appendChild(price);
    card.appendChild(rating);
    productList.appendChild(card);
  });
}

function applyFilterSort() {
  let out = [...products];

  const cat = filterCategory?.value || 'all';
  if (cat !== 'all') out = out.filter(p => p.category === cat);

  const maxPrice = Number(filterPrice?.value);
  if (!Number.isNaN(maxPrice) && filterPrice?.value !== '') {
    out = out.filter(p => p.price <= maxPrice);
  }

  const sort = sortSelect?.value || 'price-asc';
  switch (sort) {
    case 'price-asc': out.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': out.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': out.sort((a,b)=>b.rating-a.rating); break;
    case 'name-asc': out.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }

  renderProducts(out);
}

applyFilters?.addEventListener('click', applyFilterSort);
resetFilters?.addEventListener('click', () => {
  if (filterCategory) filterCategory.value = 'all';
  if (filterPrice) filterPrice.value = '';
  if (sortSelect) sortSelect.value = 'price-asc';
  renderProducts(products);
});

renderProducts(products);

/* =========================
   Contact form (demo only)
   ========================= */
const contactSubmit = document.getElementById('contactSubmit');
contactSubmit?.addEventListener('click', () => {
  const n = document.getElementById('name')?.value.trim();
  const e = document.getElementById('email')?.value.trim();
  const m = document.getElementById('message')?.value.trim();
  if (!n || !e || !m) {
    alert('Please fill all fields.');
    return;
  }
  alert('Thanks! This is a demo submission.');
});