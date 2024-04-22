import { Category } from "../models/Category.js";
export declare class CategoryManager {
    private categories;
    constructor();
    addCategory(name: string): Promise<Category>;
    getCategories(): Promise<Category[]>;
    private saveCategories;
    private loadCategories;
}
