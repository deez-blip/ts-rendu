export class TaskManager {
    tasks = [];
    constructor() {
        this.loadTasks();
    }
    async addTask(task) {
        this.tasks.push(task);
        await this.saveTasks();
    }
    async getTasks() {
        return this.tasks;
    }
    async getTaskById(taskId) {
        // Return the task with the matching ID or undefined if no match is found
        return this.tasks.find(task => task.id === taskId);
    }
    async deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        await this.saveTasks();
    }
    async editTask(taskId, updatedTask) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
            await this.saveTasks();
        }
    }
    async saveTasks() {
        // Simulate asynchronous behavior with a timeout or return a resolved promise directly
        return new Promise(resolve => {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            resolve();
        });
    }
    async loadTasks() {
        return new Promise(resolve => {
            const tasks = localStorage.getItem('tasks');
            if (tasks) {
                this.tasks = JSON.parse(tasks).map((task) => ({
                    ...task,
                    dueDate: new Date(task.dueDate)
                }));
            }
            else {
                this.tasks = [];
            }
            resolve();
        });
    }
}
