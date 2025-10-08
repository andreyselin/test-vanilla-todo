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

  listInputUpdate = (newDescription, id) => {
    const toDoLists = this.getTasksListFromStorage();
    const updateList = toDoLists[id];

    toDoLists.forEach((item) => {
      if (item === updateList) {
        item.description = newDescription;
      }
    });

    this.addListToStorage(toDoLists);
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
  createTaskDomElement = ({ uuid, description, completed, index }) => {
    const ul = document.createElement('ul');
    ul.className = 'to-do';
    ul.innerHTML = `
        <li><input class="checkbox" data-uuid="${uuid}" id="${index}" type="checkbox" ${completed ? 'checked' : ''}></li> 
        <li>
          <input
            id="LIST${index}"
            data-uuid="${uuid}"
            type="text"
            class="text-input ${completed ? 'text-input_completed' : ''}"
            value="${description}"
            readonly
          />
        </li>
        <li class="remove-edit">
          <button class="edit_list_btn" id="${index}"><i class="fa fa-ellipsis-v icon"></i></button>
          <button class="remove_btn" id="${index}"><i class="fa fa-trash-can icon"></i></button>
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
    this.editListBtnEvent();
    this.updateListBtnEvent();

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

  // update to do list
  updateListBtnEvent = () => {
    document.querySelectorAll('.text').forEach((input) => input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const inputListId = 'LIST';
        const ListIdSelected = event.currentTarget.id;
        let listID;

        if (!ListIdSelected.includes('LIST')) {
          listID = inputListId.concat(ListIdSelected);
        } else {
          listID = ListIdSelected;
        }

        document.getElementById(listID).setAttribute('readonly', 'readonly');
        this.listInputUpdate(document.getElementById(listID).value, (Number(listID.replace('LIST', '')) - 1));
      }
    }));
  }

  // edit list
  editListBtnEvent = () => {
    let previousList = null;
    document.querySelectorAll('.edit_list_btn').forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      const inputListId = 'LIST';
      const ListIdSelected = event.currentTarget.id;
      let listID;

      if (!ListIdSelected.includes('LIST')) {
        listID = inputListId.concat(ListIdSelected);
      } else {
        listID = ListIdSelected;
      }

      if (previousList !== null) {
        previousList.getElementById(listID).removeAttribute('readonly');
      }

      const listItem = event.target.closest('li');
      previousList = listItem;
      const ulItem = event.target.closest('ul');

      listItem.style.background = 'rgb(230, 230, 184)';
      ulItem.style.background = 'rgb(230, 230, 184)';

      document.getElementById(listID).removeAttribute('readonly');
      document.getElementById(listID).focus();
      document.getElementById(listID).style.background = 'rgb(230, 230, 184)';
      listItem.querySelector('.edit_list_btn').style.display = 'none';
      listItem.querySelector('.remove_btn').style.display = 'block';
    }));
  };
}

export const tasksService = new TasksService();
