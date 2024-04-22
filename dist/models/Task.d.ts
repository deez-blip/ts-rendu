export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    categoryId: string | null;
}
export declare class TaskClass implements Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    categoryId: string | null;
    constructor(id: string, title: string, description: string, dueDate: Date, priority: string, categoryId: string | null);
}
