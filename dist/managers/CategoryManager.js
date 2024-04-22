import { Category } from "../models/Category.js";
export class CategoryManager {
    categories = [];
    constructor() {
        this.loadCategories();
    }
    async addCategory(name) {
        const newCategory = new Category(crypto.randomUUID(), name);
        this.categories.push(newCategory);
        await this.saveCategories();
        return newCategory;
    }
    async getCategories() {
        return this.categories;
    }
    async saveCategories() {
        return new Promise((resolve) => {
            localStorage.setItem('categories', JSON.stringify(this.categories));
            resolve();
        });
    }
    async loadCategories() {
        return new Promise((resolve) => {
            const storedCategories = localStorage.getItem('categories');
            if (storedCategories) {
                this.categories = JSON.parse(storedCategories);
            }
            resolve();
        });
    }
}
