import { Task } from "../models/Task";
export declare class TaskManager {
    private tasks;
    constructor();
    addTask(task: Task): Promise<void>;
    getTasks(): Promise<Task[]>;
    getTaskById(taskId: string): Promise<Task | undefined>;
    deleteTask(taskId: string): Promise<void>;
    editTask(taskId: string, updatedTask: Task): Promise<void>;
    private saveTasks;
    private loadTasks;
}
