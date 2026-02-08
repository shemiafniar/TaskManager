class Task {
  constructor(title, description, priority, status, createdBy, tags = []) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.createdBy = createdBy;
    this.createdAt = new Date().toLocaleString();
    this.lastUpdatedBy = createdBy;
    this.lastUpdatedAt = this.createdAt;
    this.tags = tags;
  }
}

const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const statusInput = document.getElementById('status');
const createdByInput = document.getElementById('createdBy');
const tagsInput = document.getElementById('tags');
const addButton = document.getElementById('addTask');
const tasksDiv = document.getElementById('tasks');

const filterStatus = document.getElementById('filterStatus');
const filterCreator = document.getElementById('filterCreator');
const filterTag = document.getElementById('filterTag');
const sortBy = document.getElementById('sortBy');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  tasksDiv.innerHTML = '';
  let filtered = [...tasks];

  const statusF = filterStatus?.value;
  if(statusF && statusF !== 'all') filtered = filtered.filter(t => t.status === statusF);

  const creatorF = filterCreator?.value;
  if(creatorF && creatorF !== 'all') filtered = filtered.filter(t => t.createdBy === creatorF);

  const tagF = filterTag?.value.trim().toLowerCase();
  if(tagF) filtered = filtered.filter(t => t.tags.some(tag => tag.toLowerCase() === tagF));

  const sortF = sortBy?.value;
  if(sortF === 'priority') filtered.sort((a,b) => b.priority - a.priority);
  else if(sortF === 'createdAt') filtered.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if(sortF === 'lastUpdated') filtered.sort((a,b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));

  filtered.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task-card');

    let color;
    if(task.priority == 3) color = '#ff4d4d';
    else if(task.priority == 2) color = '#ffcc00';
    else color = '#66cc66';

    taskEl.innerHTML = `
      <h3 style="color:${color}">${task.title}</h3>
      <p>${task.description}</p>
      <p>סטטוס: ${task.status} | נוצר על ידי: ${task.createdBy}</p>
      <p>תגיות: ${task.tags.join(', ') || '-'}</p>
      <p>עדכון אחרון: ${task.lastUpdatedBy} · ${task.lastUpdatedAt}</p>
      <button onclick="markDone(${task.id})">✔️ בוצעה</button>
      <button onclick="deleteTask(${task.id})">🗑 מחיקה</button>
    `;
    tasksDiv.appendChild(taskEl);
  });
}

addButton.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const priority = parseInt(priorityInput.value);
  const status = statusInput.value;
  const createdBy = createdByInput.value;
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);

  if(!title) return alert('צריך שם משימה!');

  const newTask = new Task(title, description, priority, status, createdBy, tags);
  tasks.push(newTask);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();

  titleInput.value = '';
  descInput.value = '';
  tagsInput.value = '';
});

function markDone(id) {
  tasks = tasks.map(task => {
    if(task.id === id) {
      task.status = 'done';
      task.lastUpdatedAt = new Date().toLocaleString();
      task.lastUpdatedBy = task.createdBy;
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(id) {
  if(!confirm('למחוק משימה?')) return;
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

renderTasks();
