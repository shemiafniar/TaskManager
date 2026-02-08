// מחלקת משימה
class Task {
  constructor(title, description, priority, status, createdBy) {
    this.id = Date.now();           // מזהה ייחודי
    this.title = title;
    this.description = description;
    this.priority = priority;       // 1=נמוכה, 2=בינונית, 3=גבוהה
    this.status = status;           // open, in-progress, done
    this.createdBy = createdBy;
    this.createdAt = new Date().toLocaleString();
    this.lastUpdatedBy = createdBy;
    this.lastUpdatedAt = this.createdAt;
    this.tags = [];                 // נשאיר ריק לשלב ראשון
  }
}

// קבלת אלמנטים
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const statusInput = document.getElementById('status');
const createdByInput = document.getElementById('createdBy');
const addButton = document.getElementById('addTask');
const tasksDiv = document.getElementById('tasks');

// טען משימות מ-localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// פונקציה להצגה במסך
function renderTasks() {
  tasksDiv.innerHTML = '';

  // מיון לפי עדיפות יורדת
  const sortedTasks = tasks.sort((a,b) => b.priority - a.priority);

  sortedTasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task-card');
    
    let color;
    if(task.priority == 3) color = '#ff4d4d';       // גבוהה
    else if(task.priority == 2) color = '#ffcc00';  // בינונית
    else color = '#66cc66';                         // נמוכה

    taskEl.innerHTML = `
      <h3 style="color:${color}">${task.title}</h3>
      <p>${task.description}</p>
      <p>סטטוס: ${task.status} | נוצר על ידי: ${task.createdBy}</p>
      <p>עדכון אחרון: ${task.lastUpdatedBy} · ${task.lastUpdatedAt}</p>
      <button onclick="markDone(${task.id})">✔️ בוצעה</button>
      <button onclick="deleteTask(${task.id})">🗑 מחיקה</button>
    `;
    tasksDiv.appendChild(taskEl);
  });
}

// הוספת משימה
addButton.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const priority = parseInt(priorityInput.value);
  const status = statusInput.value;
  const createdBy = createdByInput.value;

  if(!title) return alert('צריך שם משימה!');

  const newTask = new Task(title, description, priority, status, createdBy);
  tasks.push(newTask);

  localStorage.setItem('tasks', JSON.stringify(tasks));

  // ריענון תצוגה
  renderTasks();

  // איפוס הטופס
  titleInput.value = '';
  descInput.value = '';
});

// סימון בוצעה
function markDone(id) {
  tasks = tasks.map(task => {
    if(task.id === id) {
      task.status = 'done';
      task.lastUpdatedAt = new Date().toLocaleString();
      task.lastUpdatedBy = task.createdBy; // אפשר לשנות לאדם שמסמן
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// מחיקה
function deleteTask(id) {
  if(!confirm('למחוק משימה?')) return;
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// הפעלה ראשונית
renderTasks();