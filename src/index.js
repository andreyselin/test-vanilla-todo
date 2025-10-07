import './style.css';

import { tasksService } from './tasks.service.js';
import { tasksController } from './tasks.controller.js';

const createTaskForm = document.getElementById('createTaskForm');
const addList = document.getElementById('addList');

createTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  tasksService.addTask(addList.value);
  addList.value = '';
});

document.querySelector('#archiveButton')
  .addEventListener('click', () => tasksController.archiveCompletedTasks());

window.addEventListener('load', () => {
  document.addEventListener('listUpdated', () => {
    tasksController.assignCheckboxEventHandlers();
  }, false);
  tasksController.assignCheckboxEventHandlers();
});

tasksService.showTasks();
