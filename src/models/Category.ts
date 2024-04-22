export interface ICategory {
    id: string;
    name: string;
}

export class Category implements ICategory {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}