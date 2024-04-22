export interface ICategory {
    id: string;
    name: string;
}
export declare class Category implements ICategory {
    id: string;
    name: string;
    constructor(id: string, name: string);
}
