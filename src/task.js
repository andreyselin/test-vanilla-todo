export class Task {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.archived = false;
    this.index = index;
  }
}
