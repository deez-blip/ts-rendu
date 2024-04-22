import { Category } from "../models/Category.js";

export class CategoryManager {
    private categories: Category[] = [];

    constructor() {
        this.loadCategories();
    }

    public async addCategory(name: string): Promise<Category> {
        const newCategory = new Category(crypto.randomUUID(), name);
        this.categories.push(newCategory);
        await this.saveCategories();
        return newCategory;
    }

    public async getCategories(): Promise<Category[]> {
        return this.categories;
    }

    private async saveCategories(): Promise<void> {
        return new Promise((resolve) => {
            localStorage.setItem('categories', JSON.stringify(this.categories));
            resolve();
        });
    }

    private async loadCategories(): Promise<void> {
        return new Promise((resolve) => {
            const storedCategories = localStorage.getItem('categories');
            if (storedCategories) {
                this.categories = JSON.parse(storedCategories) as Category[];
            }
            resolve();
        });
    }
}
