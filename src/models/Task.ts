export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    categoryId: string | null;
}

export class TaskClass implements Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    categoryId: string | null;

    constructor(id: string, title: string, description: string, dueDate: Date, priority: string, categoryId: string | null) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.categoryId = categoryId;
    }
}
