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
  createTaskDomElement = ({ uuid, description, content, completed, index }) => {
    const ul = document.createElement('ul');
    ul.className = 'to-do';
    ul.setAttribute('data-uuid', uuid);
    ul.innerHTML = `
        <li class="task-checkbox-container"><input class="checkbox" data-uuid="${uuid}" id="${index}" type="checkbox" ${completed ? 'checked' : ''}></li> 
        <li class="task-text-inputs-container">
          <input
            id="LIST${index}"
            data-uuid="${uuid}"
            type="text"
            class="text-input ${completed ? 'text-input_completed' : ''}"
            value="${description}"
            readonly
            required
          />
          ok
        </li>
        <li class="remove-edit">
          <button class="small-button edit_list_btn" data-uuid="${uuid}" id="${index}"><i class="fa fa-ellipsis-v icon"></i></button>
          <div class="task-controls" data-uuid="${uuid}">
          
            ${
              content === null
                ? `<button class="small-button add-content" data-uuid="${uuid}" id="${index}"><i class="fa fa-file-lines icon"></i></button>`
                : `<button class="small-button remove-content" data-uuid="${uuid}" id="${index}"><i class="fa fa-text-slash icon"></i></button>`
            }
            <button class="small-button remove_btn" data-uuid="${uuid}" id="${index}"><i class="fa fa-trash-can icon"></i></button>
            <button class="small-button hide-controls" data-uuid="${uuid}" id="${index}"><i class="fa fa-ellipsis-v icon"></i></button>
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
    // this.editListBtnEvent();
    this.assignInlineTextEventHandlers();
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

  // update to do list
  assignInlineTextEventHandlers = () => {
    document.querySelectorAll('.text-input').forEach((input) => input.addEventListener('keypress', (event) => {
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

  assignControlsEventHandlers() {
    let previousList = null;

    document.querySelectorAll('.to-do').forEach(taskElement => {
      taskElement.querySelector('.hide-controls').addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          taskElement.querySelector('.text-input').classList.remove('being-edited');
          taskElement.querySelector('.task-controls').style.display = 'none';
          taskElement.querySelector('.edit_list_btn').style.display = 'block';
        }
      );

      // Just copied here so far:
      taskElement.querySelector('.edit_list_btn').addEventListener('click', (event) => {
        event.preventDefault();
        const inputListId = 'LIST';
        const ListIdSelected = event.currentTarget.id;
        let listID;

        if (!ListIdSelected.includes('LIST')) {
          listID = inputListId.concat(ListIdSelected);
        } else {
          listID = ListIdSelected;
        }

        // if (previousList !== null) {
        //   previousList.getElementById(listID).removeAttribute('readonly');
        // }

        const listItem = event.target.closest('li');
        // previousList = listItem;
        const ulItem = event.target.closest('ul');

        listItem.style.background = 'rgb(230, 230, 184)';
        ulItem.style.background = 'rgb(230, 230, 184)';

        document.getElementById(listID).removeAttribute('readonly');
        document.getElementById(listID).focus();
        document.getElementById(listID).style.background = 'rgb(230, 230, 184)';
        listItem.querySelector('.edit_list_btn').style.display = 'none';
        listItem.querySelector('.task-controls').style.display = 'flex';
        taskElement.querySelector('.text-input').classList.add('being-edited');
      })
    })
  }

/*
  // edit list
  editListBtnEvent = () => {
    let previousList = null;
    document.querySelectorAll('.edit_list_btn')
      .forEach((button) => button.addEventListener('click', (event) => {
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
        listItem.querySelector('.task-controls').style.display = 'flex';
      }));
  };
  */
}

export const tasksService = new TasksService();
