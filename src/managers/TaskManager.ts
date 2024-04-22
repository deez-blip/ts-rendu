import { Task } from "../models/Task";

export class TaskManager {
    private tasks: Task[] = [];

    constructor() {
        this.loadTasks(); 
    }

    public async addTask(task: Task): Promise<void> {
        this.tasks.push(task);
        await this.saveTasks();
    }

    public async getTasks(): Promise<Task[]> {
        return this.tasks;
    }

    public async getTaskById(taskId: string): Promise<Task | undefined> {
        // Return the task with the matching ID or undefined if no match is found
        return this.tasks.find(task => task.id === taskId);
    }

    public async deleteTask(taskId: string): Promise<void> {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        await this.saveTasks();
    }

    public async editTask(taskId: string, updatedTask: Task): Promise<void> {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
            await this.saveTasks();
        }
    }

    private async saveTasks(): Promise<void> {
        // Simulate asynchronous behavior with a timeout or return a resolved promise directly
        return new Promise(resolve => {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            resolve();
        });
    }

    private async loadTasks(): Promise<void> {
        return new Promise(resolve => {
            const tasks = localStorage.getItem('tasks');
            if (tasks) {
                this.tasks = JSON.parse(tasks).map((task: any) => ({
                    ...task,
                    dueDate: new Date(task.dueDate)
                }));
            } else {
                this.tasks = [];
            }
            resolve();
        });
    }
}
