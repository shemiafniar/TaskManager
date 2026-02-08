class Task {
  constructor(title, description, priority, status, createdBy, tags = [], dueDate = '') {
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
    this.dueDate = dueDate;
  }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

// אלמנטים
const tasksDiv = document.getElementById('tasks');
const highPriorityDiv = document.querySelector('#high-priority .tasks-container');
const mediumPriorityDiv = document.querySelector('#medium-priority .tasks-container');
const lowPriorityDiv = document.querySelector('#low-priority .tasks-container');

const modal = document.getElementById('task-modal');
const openFormBtn = document.getElementById('open-task-form');
const closeModalBtn = document.querySelector('.close');
const saveTaskBtn = document.getElementById('saveTask');

const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const statusInput = document.getElementById('status');
const createdByInput = document.getElementById('createdBy');
const tagsInput = document.getElementById('tags');
const dueDateInput = document.getElementById('dueDate');

// --- פונקציות ---

function openModal(editTask = null) {
  modal.style.display = 'block';
  if(editTask){
    editingTaskId = editTask.id;
    titleInput.value = editTask.title;
    descInput.value = editTask.description;
    priorityInput.value = editTask.priority;
    statusInput.value = editTask.status;
    createdByInput.value = editTask.createdBy;
    tagsInput.value = editTask.tags.join(', ');
    dueDateInput.value = editTask.dueDate;
    document.getElementById('modal-title').innerText = 'עריכת משימה';
  } else {
    editingTaskId = null;
    document.getElementById('modal-title').innerText = 'יצירת משימה';
    titleInput.value = descInput.value = tagsInput.value = dueDateInput.value = '';
    priorityInput.value = 3;
    statusInput.value = 'open';
    createdByInput.value = 'שמי';
  }
}

function closeModal() { modal.style.display = 'none'; }

openFormBtn.onclick = () => openModal();
closeModalBtn.onclick = () => closeModal();
window.onclick = e => { if(e.target == modal) closeModal(); }

function saveTask() {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const priority = parseInt(priorityInput.value);
  const status = statusInput.value;
  const createdBy = createdByInput.value;
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
  const dueDate = dueDateInput.value;

  if(!title) return alert('צריך שם משימה!');

  if(editingTaskId){
    // עריכה
    tasks = tasks.map(t => {
      if(t.id === editingTaskId){
        t.title = title;
        t.description = description;
        t.priority = priority;
        t.status = status;
        t.createdBy = createdBy;
        t.tags = tags;
        t.dueDate = dueDate;
        t.lastUpdatedAt = new Date().toLocaleString();
        t.lastUpdatedBy = createdBy;
      }
      return t;
    });
  } else {
    // יצירה
    const newTask = new Task(title, description, priority, status, createdBy, tags, dueDate);
    tasks.push(newTask);
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  closeModal();
}

saveTaskBtn.onclick = saveTask;

function renderTasks() {
  tasksDiv.innerHTML = '';
  highPriorityDiv.innerHTML = '';
  mediumPriorityDiv.innerHTML = '';
  lowPriorityDiv.innerHTML = '';

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.classList.add('task-card');

    // צבע עדיפות
    let color = '#66cc66';
    if(task.priority == 2) color = '#ffcc00';
    else if(task.priority == 3) color = '#ff4d4d';

    card.innerHTML = `
      <div class="task-info">
        <p class="task-title">${task.title}</p>
        <p class="task-meta">${task.description}</p>
        <p class="task-meta">סטטוס: ${task.status} | נוצר: ${task.createdBy}</p>
        <p class="task-meta">תאריך יעד: ${task.dueDate || '-'}</p>
        <p class="task-meta">עדכון אחרון: ${task.lastUpdatedBy} · ${task.lastUpdatedAt}</p>
        <p class="task-meta">תגיות: ${task.tags.join(', ') || '-'}</p>
      </div>
      <div>
        <span class="priority-indicator" style="background:${color}"></span>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="markDone(${task.id})">✔️</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    tasksDiv.appendChild(card);

    // גם לדשבורד לפי עדיפות
    if(task.priority === 3) highPriorityDiv.appendChild(card.cloneNode(true));
    else if(task.priority === 2) mediumPriorityDiv.appendChild(card.cloneNode(true));
    else lowPriorityDiv.appendChild(card.cloneNode(true));
  });
}

function markDone(id){
  tasks = tasks.map(t => { if(t.id === id) t.status = 'done'; return t; });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(id){
  if(!confirm('למחוק משימה?')) return;
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function editTask(id){
  const task = tasks.find(t => t.id === id);
  if(task) openModal(task);
}

// הפעלה ראשונית
renderTasks();
