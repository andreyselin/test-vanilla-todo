import { Task } from './task.js';
import { localStorageKeys, statusesToFilter } from './const.js';

class TasksService {
  getStoredFilterStatus = () => {
    return localStorage.getItem(localStorageKeys.statusToFilter) || statusesToFilter.all;
  }
  setStoredFilterStatus = (filterStatus) => {
    localStorage.setItem(localStorageKeys.statusToFilter, filterStatus);
  }

  getTasksListFromStorage = () => {
    let toDoLists;

    if (JSON.parse(localStorage.getItem(localStorageKeys.tasksList)) === null) {
      toDoLists = [];
    } else {
      toDoLists = JSON.parse(localStorage.getItem(localStorageKeys.tasksList));
    }
    return toDoLists;
  };

  saveTasks = (toDoLists) => {
    const item = JSON.stringify(toDoLists);
    localStorage.setItem(localStorageKeys.tasksList, item);
  };

  archiveTask = (uuid) => {
    let tasks = this.getTasksListFromStorage();
    const updatedTasks = tasks.map((item) => item.uuid === uuid ? { ...item, archived: true } : item);
    this.saveTasks(updatedTasks);
  };

  onTextUpdate = (newDescription, uuid) => {
    const storedTasks = this.getTasksListFromStorage();

    const updatedTasks = storedTasks.map((item) =>
      item.uuid === uuid
        ? { ...item, description: newDescription }
        : item
    );

    this.saveTasks(updatedTasks);
    this.showTasks();
  };

  createTaskDomElement = ({ uuid, description, content, completed, index }) => {
    const div = document.createElement('div');
    div.className = 'to-do-wrapper';
    div.setAttribute('data-uuid', uuid);
    div.innerHTML = `
      <ul class="to-do">
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
        </li>
        <li class="remove-edit">
          <button class="small-button edit_list_btn" id="${index}"><i class="fa fa-ellipsis-v icon"></i></button>
          <div class="task-controls">
            <button class="small-button add-content ${ content === null ? '' : 'hidden' }"><i class="fa fa-plus icon"></i></button>
            <button class="small-button remove-content ${ content === null ? 'hidden' : '' }"><i class="fa fa-times icon"></i></button>
            <button class="small-button remove_btn" id="${index}"><i class="fa fa-box-archive icon"></i></button>
            <button class="small-button hide-controls" id="${index}"><i class="fa fa-ellipsis-v icon"></i></button>
          </div>
        </li>
      </ul>
      
      ${content === null ? '' : `
        <div class="content-container">
          <textarea class="content-input" placeholder="Content">${content}</textarea>
        </div>
      `}
    `;
    return div;
  }

  setContent(uuid, content) {
    const allTasks = this.getTasksListFromStorage();

    const updatedTasks = allTasks.map((task) =>
      task.uuid === uuid
        ? { ...task, content }
        : task
    );

    this.saveTasks(updatedTasks);
    this.showTasks();
  }

  renderFilters = (filterStatus) => {
    const filtersContainer = document.querySelector('.filters-container');
    filtersContainer.innerHTML = `
      <label><input type="radio" name="choice" value="${statusesToFilter.all}"> All</label>
      <label><input type="radio" name="choice" value="${statusesToFilter.todo}"> Todo</label>
      <label><input type="radio" name="choice" value="${statusesToFilter.archived}"> Archived</label>
    `;
    const radios = filtersContainer.querySelectorAll('input[name="choice"]');

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.setStoredFilterStatus(radio.value);
        this.showTasks();
      });
      if (radio.value === filterStatus) {
        radio.setAttribute('checked', 'checked');
      }
    });
  }

  showTasks = () => {
    const filterStatus = this.getStoredFilterStatus();
    this.renderFilters(filterStatus);

    const tasks = this.getTasksListFromStorage();
    document.querySelector('.toDoListContainer').innerHTML = '';
    tasks.forEach((task) => {
      document
        .querySelector('.toDoListContainer')
        .appendChild(
          this.createTaskDomElement(task)
        );
    });

    this.assignControlsEventHandlers();
  };

  addTask = (description) => {
    const allTasks = this.getTasksListFromStorage();
    const index = allTasks.length + 1;
    const newTask = new Task(description, false, index);

    allTasks.push(newTask);
    this.saveTasks(allTasks);
    this.showTasks();
  }

  onToggleCompleted = (isChecked, uuid) => {
    const tasks = tasksService.getTasksListFromStorage();
    const updatedTasks = tasks.map(el => el.uuid === uuid ? { ...el, completed: isChecked } : el);
    tasksService.saveTasks(updatedTasks);
    tasksService.showTasks();
  }

  archiveCompletedTasks = () => {
    const tasks = this.getTasksListFromStorage();
    const updatedTasks = tasks.map((item) => item.completed ? { ...item, archived: true } : item);
    tasksService.saveTasks(updatedTasks);
    this.showTasks();
  }

  assignControlsEventHandlers() {
    document.querySelectorAll('.to-do-wrapper').forEach(taskElement => {
      const uuid = taskElement.getAttribute('data-uuid');
      const textInputElement = taskElement.querySelector('.text-input');
      const taskControlsElement = taskElement.querySelector('.task-controls');
      const showControlsElement = taskElement.querySelector('.edit_list_btn');
      const hideControlsElement = taskElement.querySelector('.hide-controls');
      const addContentElement = taskElement.querySelector('.add-content');
      const removeContentElement = taskElement.querySelector('.remove-content');
      const contentInputElement = taskElement.querySelector('.content-input');
      const checkboxInputElement = taskElement.querySelector('.checkbox');
      const removeTaskElement = document.querySelector('.remove_btn');

      removeTaskElement.addEventListener('click', (event) => {
        event.preventDefault();
        this.archiveTask(uuid);
      });

      checkboxInputElement.addEventListener('change', () => {
        const isChecked = checkboxInputElement.checked === true;
        this.onToggleCompleted(isChecked, uuid);
      });

      hideControlsElement.addEventListener('click', () => {
        textInputElement.classList.remove('being-edited');
        taskControlsElement.style.display = 'none';
        showControlsElement.style.display = 'block';
        taskElement.style.background = 'none';
      });

      showControlsElement.addEventListener('click', () => {
        taskElement.style.background = 'rgb(230, 230, 184)';
        showControlsElement.style.display = 'none';
        taskControlsElement.style.display = 'flex';

        textInputElement.removeAttribute('readonly');
        textInputElement.focus();
        textInputElement.classList.add('being-edited');
      });

      textInputElement.addEventListener(
        'click',
        () => {
          textInputElement.removeAttribute('readonly');
          textInputElement.classList.add('being-edited');
        }
      );

      textInputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          textInputElement.setAttribute('readonly', 'readonly');
          textInputElement.classList.remove('being-edited');
          this.onTextUpdate(textInputElement.value, uuid);
        }
      });

      addContentElement.addEventListener('click', () => {
        this.setContent(uuid, '');
      });

      removeContentElement.addEventListener('click', () => {
        this.setContent(uuid, null);
      });

      contentInputElement?.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          contentInputElement.setAttribute('readonly', 'readonly');
          contentInputElement.classList.remove('being-edited');
          this.setContent(uuid, contentInputElement.value);
        }
      });

      contentInputElement?.addEventListener('click', () => {
        contentInputElement.classList.add('being-edited');
        contentInputElement.removeAttribute('readonly');
      });
    });
  }
}

export const tasksService = new TasksService();
