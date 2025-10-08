// import from src modules folder

import { Task } from './task.js';
import { localStorageKeys, statusesToFilter } from './const.js';

// get listed inputs from local storage

class TasksService {
  getTasksListFromStorage = () => {
    let toDoLists;

    if (JSON.parse(localStorage.getItem(localStorageKeys.tasksList)) === null) {
      toDoLists = [];
    } else {
      toDoLists = JSON.parse(localStorage.getItem(localStorageKeys.tasksList));
    }
    return toDoLists;
  };

  // add listed inputs to the local storage
  addListToStorage = (toDoLists) => {
    const item = JSON.stringify(toDoLists);
    localStorage.setItem(localStorageKeys.tasksList, item);
  };

  // index list inputs by number
  newIndexNum = (toDoLists) => {
    toDoLists.forEach((item, i) => {
      item.index = i + 1;
    });
  }

  // delete from local storage
  deleteListData = (id) => {
    let toDoLists = this.getTasksListFromStorage();
    const ListItemToDelete = toDoLists[id];

    toDoLists = toDoLists.filter((item) => item !== ListItemToDelete);

    this.newIndexNum(toDoLists);
    this.addListToStorage(toDoLists);
  };

  listInputUpdate = (newDescription, uuid) => {
    const storedTasks = this.getTasksListFromStorage();

    const updatedTasks = storedTasks.map((item) =>
      item.uuid === uuid
        ? { ...item, description: newDescription }
        : item
    );

    this.addListToStorage(updatedTasks);
    this.showTasks();
  };

  removeToDoListBtn = () => {
    document.querySelectorAll('.remove_btn').forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      let id;
      if (button.id > 0) {
        id = button.id - 1;
      } else {
        id = 0;
      }
      this.deleteListData(id);
      this.showTasks();
    }));
  };

  // section created dynamically
  createTaskDomElement = ({ uuid, description, content, completed, index }) => {
    const ul = document.createElement('ul');
    ul.className = 'to-do';
    ul.setAttribute('data-uuid', uuid);
    ul.innerHTML = `
        <li class="task-checkbox-container"><input class="checkbox" data-uuid="${uuid}" id="${index}" type="checkbox" ${completed ? 'checked' : ''}></li> 
        <li class="task-text-inputs-container">
          <input
            id="LIST${index}"
            type="text"
            class="text-input ${completed ? 'text-input_completed' : ''}"
            value="${description}"
            readonly
            required
          />
          ok
        </li>
        <li class="remove-edit">
          <button class="small-button edit_list_btn" id="${index}"><i class="fa fa-ellipsis-v icon"></i></button>
          <div class="task-controls">
          
            ${
              content === null
                ? `<button class="small-button add-content" id="${index}"><i class="fa fa-file-lines icon"></i></button>`
                : `<button class="small-button remove-content" id="${index}"><i class="fa fa-text-slash icon"></i></button>`
            }
            <button class="small-button remove_btn" id="${index}"><i class="fa fa-trash-can icon"></i></button>
            <button class="small-button hide-controls" id="${index}"><i class="fa fa-ellipsis-v icon"></i></button>
          </div>
        </li>
      `;
    return ul;
  }

  // show listed tasks
  showTasks = () => {
    const tasks = this.getTasksListFromStorage();
    document.querySelector('.toDoListContainer').innerHTML = '';
    tasks.forEach((task) => {
      document
        .querySelector('.toDoListContainer')
        .appendChild(
          this.createTaskDomElement(task)
        );
    });

    this.removeToDoListBtn();
    this.assignControlsEventHandlers();

    const event = new Event('listUpdated');
    document.dispatchEvent(event);
  };

  // add a task to a list
  addTask = (description) => {
    const allTasks = this.getTasksListFromStorage();
    const index = allTasks.length + 1;
    const newTask = new Task(description, false, index);

    allTasks.push(newTask);
    this.addListToStorage(allTasks);
    this.showTasks();
  }

  assignControlsEventHandlers() {
    document.querySelectorAll('.to-do').forEach(taskElement => {
      const uuid = taskElement.getAttribute('data-uuid');
      const textInputElement = taskElement.querySelector('.text-input')
      const taskControlsElement = taskElement.querySelector('.task-controls');
      const showControlsElement = taskElement.querySelector('.edit_list_btn');
      const hideControlsElement = taskElement.querySelector('.hide-controls');

      hideControlsElement.addEventListener('click', (event) => {
        event.preventDefault();
        textInputElement.classList.remove('being-edited');
        taskControlsElement.style.display = 'none';
        showControlsElement.style.display = 'block';
        taskElement.style.background = 'none';
      });

      taskControlsElement.addEventListener('click', (event) => {
        event.preventDefault();

        taskElement.style.background = 'rgb(230, 230, 184)';
        showControlsElement.style.display = 'none';
        taskControlsElement.style.display = 'flex';

        textInputElement.removeAttribute('readonly');
        textInputElement.focus();
        textInputElement.classList.add('being-edited');
      });

      textInputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          textInputElement.setAttribute('readonly', 'readonly');
          textInputElement.classList.remove('being-edited');
          this.listInputUpdate(textInputElement.value, uuid);
        }
      });
    });
  }
}

export const tasksService = new TasksService();
