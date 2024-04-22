import { Category } from "models/Category.js";
import { TaskManager } from "./managers/TaskManager.js";
import { CategoryManager } from "./managers/CategoryManager.js";

declare global {
    interface Window {
        deleteTask: (taskId: string) => Promise<void>;
        editTask: (taskId: string) => Promise<void>;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    searchButton.addEventListener('click', async () => {
        const searchQuery = searchInput.value.trim().toLowerCase();
        await renderTasks(undefined, undefined, searchQuery);
    });

    const highlight = (text: string, keyword: string): string => {
        if (!keyword) {
            return text;
        }
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    const categoryManager = new CategoryManager();
    const taskManager = new TaskManager();


    const categoryForm = document.getElementById('categoryForm') as HTMLFormElement;
    const categoryNameInput = document.getElementById('categoryName') as HTMLInputElement;
    const categorySelect = document.getElementById('taskCategory') as HTMLSelectElement;
    const categorySelectFilter = document.getElementById('taskCategoryFilter') as HTMLSelectElement;

    categoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = categoryNameInput.value.trim();
        if (name) {
            const newCategory = await categoryManager.addCategory(name);
            const option = new Option(newCategory.name, newCategory.id);
            categorySelect.add(option);
            categorySelectFilter.add(option);
            categoryNameInput.value = ''; // Clear the input after adding
        }
    });
    
    // Function to populate the category dropdown
    const loadCategories = async () => {
        const categories = await categoryManager.getCategories();
        const categorySelect = document.getElementById('taskCategory') as HTMLSelectElement;
        const categorySelectFilter = document.getElementById('taskCategoryFilter') as HTMLSelectElement;
        categorySelect.innerHTML = '<option value="">Select Category</option>'; // Reset dropdown

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelectFilter.appendChild(option)
        });
    };

    // Call the function to populate the categories dropdown
    await loadCategories();

    // Function to display tasks
    const renderTasks = async (priorityFilter?: string, dateFilter?: Date, searchQuery?: string, categoryFilter?: string): Promise<void> => {
        const tasksContainer = document.getElementById('tasks');
        if (tasksContainer) {
            tasksContainer.innerHTML = '';
            
            const tasks = await taskManager.getTasks();

            tasks.forEach(task => {
                if (priorityFilter && priorityFilter !== 'all' && task.priority.toLowerCase() !== priorityFilter) {
                    return;
                }

                if (dateFilter && task.dueDate > dateFilter) {
                    return;
                }

                if (searchQuery && !task.title.toLowerCase().includes(searchQuery) && !task.description.toLowerCase().includes(searchQuery)) {
                    return;
                }

                if(categoryFilter && categoryFilter != task.categoryId){
                    return
                }
                const highlightedTitle = highlight(task.title, searchQuery || '');
                const highlightedDescription = highlight(task.description, searchQuery || '');

                const taskElement = document.createElement('div');
                taskElement.className = `task ${task.priority.toLowerCase()}`;
                taskElement.innerHTML = `
                    <h3>${highlightedTitle} <span>– Priorité ${task.priority}</span></h3>
                    <p>Date d'échéance: ${task.dueDate.toISOString().split('T')[0]}</p>
                    <p>${highlightedDescription}</p>
                    <button type="button" onclick="window.deleteTask('${task.id}')">Supprimer</button>
                    <button class="edit-btn" type="button" onclick="window.editTask('${task.id}')">Modifier</button>
                `;
                tasksContainer.appendChild(taskElement);
            });
        } else {
            console.error('Tasks container not found');
        }
    };
    await renderTasks();

    const taskForm = document.getElementById('taskForm') as HTMLFormElement;
    const submitButton = taskForm.querySelector('button[type="submit"]') as HTMLButtonElement;

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        // Liste des IDs des champs obligatoires
        const requiredFields = ['taskTitle', 'taskDueDate'];  // Ajoutez d'autres champs si nécessaire
        let isFormComplete = true;
        let missingFieldName = '';
    
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId) as HTMLInputElement;
            if (!field.value) {
                isFormComplete = false;
                missingFieldName = field?.placeholder ? field.placeholder : 'Date'; // Utiliser placeholder comme nom du champ
                return;
            }
        });
    
        if (!isFormComplete) {
            alert(`Veuillez remplir le champ suivant : ${missingFieldName}`);
            return
        } else {
            (event.target as HTMLFormElement).submit(); // Soumettre le formulaire si tous les champs sont remplis
        }

        const taskId = (document.getElementById('taskId') as HTMLInputElement).value;
        const title = (document.getElementById('taskTitle') as HTMLInputElement).value;
        const description = (document.getElementById('taskDescription') as HTMLTextAreaElement).value;
        const dueDate = new Date((document.getElementById('taskDueDate') as HTMLInputElement).value);

        const priority = (document.getElementById('taskPriority') as HTMLSelectElement).value as 'Low' | 'Medium' | 'High';

        if (taskId) {
            const categoryId = (document.getElementById('taskCategory') as HTMLSelectElement).value || null;
            const updatedTask = {
                id: taskId,
                title,
                description,
                dueDate,
                priority,
                categoryId
            };
            await taskManager.editTask(taskId, updatedTask);
        } else {
            const categoryId = (document.getElementById('taskCategory') as HTMLSelectElement).value || null;
            const newTask = {
                id: crypto.randomUUID(),
                title,
                description,
                dueDate,
                priority,
                categoryId
            };
            await taskManager.addTask(newTask);
        }

        await renderTasks();
        taskForm.reset();
        (document.getElementById('taskId') as HTMLInputElement).value = '';
    });

    const deleteTask = async (taskId: string): Promise<void> => {
        await taskManager.deleteTask(taskId);
        await renderTasks();
    };

    const editTask = async (taskId: string): Promise<void> => {
        const task = await taskManager.getTaskById(taskId);
        if (task) {
            (document.getElementById('taskTitle') as HTMLInputElement).value = task.title;
            (document.getElementById('taskDescription') as HTMLTextAreaElement).value = task.description;
            (document.getElementById('taskDueDate') as HTMLInputElement).value = task.dueDate.toISOString().substring(0, 10);
            (document.getElementById('taskPriority') as HTMLSelectElement).value = task.priority;
            (document.getElementById('taskId') as HTMLInputElement).value = task.id;
            submitButton.textContent = "Modifier Tâche";
        }
    };

    window.deleteTask = deleteTask;
    window.editTask = editTask;

    const applyFilterButton = document.getElementById('applyFilter') as HTMLButtonElement;
    applyFilterButton.addEventListener('click', async () => {
        const priority = (document.getElementById('filterPriority') as HTMLSelectElement).value;
        const dateString = (document.getElementById('filterDate') as HTMLInputElement).value;
        let filterDate = dateString ? new Date(dateString) : undefined;
        const category = (document.getElementById('taskCategoryFilter') as HTMLSelectElement).value;
        await renderTasks(priority, filterDate, '', category);
    });
});
