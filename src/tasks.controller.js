import { tasksService } from './tasks.service.js';

class TasksController {
  onToggleCompleted = (statusCheck, id) => {
    const tasks = tasksService.getTasksListFromStorage();
    tasks[id].completed = statusCheck;
    tasksService.addListToStorage(tasks);
    tasksService.showTasks();
  }

  // checkbox status
  assignCheckboxEventHandlers = () => (
    document
      .querySelectorAll('.checkbox')
      .forEach((checkbox) => checkbox.addEventListener('change', () => {
        let statusCheck;
        let id;
        if (checkbox.id > 0) {
          id = checkbox.id - 1;
        } else {
          id = 0;
        }

        if (checkbox.checked === true) {
          statusCheck = true;
        } else if (checkbox.checked !== true) {
          statusCheck = false;
        }

        this.onToggleCompleted(statusCheck, id);
      }))
  )

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
