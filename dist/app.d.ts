declare global {
    interface Window {
        deleteTask: (taskId: string) => Promise<void>;
        editTask: (taskId: string) => Promise<void>;
    }
}
export {};
