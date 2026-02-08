window.onload = () => {

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

  // --- פונקציות לפתיחה וסגירה של modal ---
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

  // ... שאר הקוד נשאר אותו דבר ...

};
