import './style.css';

import { tasksService } from './tasks.service.js';

const createTaskForm = document.getElementById('createTaskForm');
const addList = document.getElementById('addList');

createTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  tasksService.addTask(addList.value);
  addList.value = '';
});

document.querySelector('#archiveButton')
  .addEventListener('click', () => tasksService.archiveCompletedTasks());

tasksService.showTasks();
