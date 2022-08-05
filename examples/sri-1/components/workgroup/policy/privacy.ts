import { IPrivacy } from "./privacy.interface";

export class Privacy implements IPrivacy {
    id: string
    name: string;
    dataVisibilityRoles: string[] = [];
    
    constructor(id: string, name: string, dataVisibilityRoles: string[]) {
        this.id = id;
        this.name = name;
        dataVisibilityRoles.forEach(role => {
            this.dataVisibilityRoles.push(role)
        });
    }

    addDataVisibilityRole(role: string, visibilityLevel: string) {
        return null;
    }
    removeDataVisibilityRole(role: string){
        return null;
    }
    updateDatavisibilityRole(role: string, ...updates: string[]){
        return null;
    }
}