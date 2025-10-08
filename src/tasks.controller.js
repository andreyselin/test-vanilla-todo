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
    const keydownHandler = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.onSaveDescription(textInput.value, textInput.getAttribute('data-uuid'));
        textInput.removeEventListener('keydown', keydownHandler);
      }
    }
    const clickOutsideHandler = (event) => {
      if (!textInput.contains(event.target)) {
        event.preventDefault();
        this.onSaveDescription(textInput.value, textInput.getAttribute('data-uuid'));
        document.removeEventListener('click', clickOutsideHandler);
      }
    }
    document.addEventListener('click', clickOutsideHandler);
    textInput.addEventListener('keydown', keydownHandler);
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

    // const updatedTodoLists = toDoLists.map((element) => {
    //   if (!element.archived && element.completed) {
    //     return {
    //       ...element,
    //       archived: true,
    //     }
    //   }
    // });

    tasksList = tasksList.filter((item) => item.completed !== true);
    tasksService.newIndexNum(tasksList);
    tasksService.addListToStorage(tasksList);
    tasksService.showTasks();
  }
}

export const tasksController = new TasksController();
