import { IPrivacy } from "./privacy.interface";

export class Privacy implements IPrivacy {
    id: string
    name: string;
    dataVisibilityRoles: Map<string, string> = new Map(); //Stores roles and Access in form <Role, Access> ex. <"admin", "CRUD">
    roleRoster: Map<string, string> = new Map(); //Stores existing users and their role in form <userId, role> ex. <"Alice", "Admin">
    
    constructor(id: string, name: string, adminId: string) {
        this.id = id;
        this.name = name;
        Object.keys(Roles).forEach((role, index) => {
            this.dataVisibilityRoles.set(role, Object.values(Roles)[index])
        });
        this.roleRoster.set(adminId, "admin");
    }

        //TODO construct implementation of custom RBAC privacy rules or import accces library for current scope purposes

    addDataVisibilityRole(requestorId: string, roleName: string, visibilityLevel: string) {};
    removeDataVisibilityRole(requestorId: string, roleName: string) {};
    updateDatavisibilityRole(requestorId: string, roleName: string, ...updates: string[]) {};
}
