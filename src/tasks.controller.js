import { tasksService } from './tasks.service.js';

class TasksController {
  onToggleCompleted = (isChecked, uuid) => {
    const tasks = tasksService.getTasksListFromStorage();
    const updatedTasks = tasks.map(el => el.uuid === uuid ? { ...el, completed: isChecked } : el);
    tasksService.addListToStorage(updatedTasks);
    tasksService.showTasks();
  }

  onSaveDescription = (description, uuid) => {
    const tasks = tasksService.getTasksListFromStorage();
    const updatedTasks = tasks.map(el => el.uuid === uuid ? { ...el, description } : el);
    tasksService.addListToStorage(updatedTasks);
    tasksService.showTasks();
  }

  onClickTextInput = (textInput) => {
    textInput.removeAttribute('readonly');
    textInput.classList.add('being-edited');
  }

  // checkbox status
  assignCheckboxEventHandlers = () => {
    document.querySelectorAll('.checkbox')
      .forEach((checkbox) => checkbox.addEventListener('change', () => {
        const uuid = checkbox.getAttribute('data-uuid');
        const isChecked = checkbox.checked === true;

        this.onToggleCompleted(isChecked, uuid);
      }));

    document.querySelectorAll('.text-input')
      .forEach((textInput) => textInput.addEventListener(
        'click',
        (event) => this.onClickTextInput(event.currentTarget)
      ));
  }

  archiveCompletedTasks = () => {
    let tasksList = tasksService.getTasksListFromStorage();
    tasksList = tasksList.filter((item) => item.completed !== true);
    tasksService.newIndexNum(tasksList);
    tasksService.addListToStorage(tasksList);
    tasksService.showTasks();
  }
}

export const tasksController = new TasksController();
