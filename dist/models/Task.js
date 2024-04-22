export class TaskClass {
    id;
    title;
    description;
    dueDate;
    priority;
    categoryId;
    constructor(id, title, description, dueDate, priority, categoryId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.categoryId = categoryId;
    }
}
