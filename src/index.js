import './style.css';

import { tasksService } from './tasks.service.js';

const createTaskForm = document.getElementById('createTaskForm');
const addList = document.getElementById('addList');
const refreshButton = document.getElementById('refreshButton');

createTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  tasksService.addTask(addList.value);
  addList.value = '';
});

document.querySelector('#archiveButton')
  .addEventListener('click', () => tasksService.archiveCompletedTasks());

refreshButton.addEventListener('click', () => {
  tasksService.showTasks();
})

tasksService.showTasks();
