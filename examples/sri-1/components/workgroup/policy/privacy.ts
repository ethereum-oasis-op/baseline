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

    addDataVisibilityRole(requestorId: string, roleName: string, visibilityLevel: string) {
        //!Loookup subject role by Id both stored on subject OR lookup subject role per workgroup here.
        const roleAccess = this.dataVisibilityRoles.get(this.roleRoster.get(requestorId) ?? '');
        if (roleAccess && roleAccess.charAt(0) == 'C') {
        return this.dataVisibilityRoles.set(roleName, visibilityLevel);
        }
        return 'Access Denied';
    }
    removeDataVisibilityRole(requestorId: string, roleName: string){
        const roleAccess = this.dataVisibilityRoles.get(this.roleRoster.get(requestorId) ?? '');
        if (roleAccess && roleAccess.charAt(3) == 'D') {
          return  this.dataVisibilityRoles.delete(roleName);
        } 
        return 'Access Denied';
    }
    updateDatavisibilityRole(requestorId: string, roleName: string, ...updates: string[]){
        const roleAccess = this.dataVisibilityRoles.get(this.roleRoster.get(requestorId) ?? '');
        if (roleAccess && roleAccess.charAt(2) == 'U' ) {
            return this.dataVisibilityRoles.set(roleName, updates)
        }
        return 'Access Denied';
    }

    //TODO implement checks for doing security actions to ones self - check for lowercase 
    //TODO Change updates to be a single string 

}

//Uppercase: can perform anywhere. Lowercase: can only perform on own items
enum Roles {
    operator = 'CRUD',
    admin = 'CRUD',
    subject = 'cRud',
    delegate = 'cRud',
}