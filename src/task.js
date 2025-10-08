import { v4 as uuidv4 } from 'uuid';

export class Task {
  constructor(description, completed, index) {
    this.uuid = uuidv4();
    this.description = description;
    this.content = null;
    this.completed = completed;
    this.archived = false;
    this.index = index;
  }
}
