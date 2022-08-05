import { ISecurity } from "./security.interface";

export class Security implements ISecurity {
    id: string
    name: string;
    AuthRules: string[] = [];
    
    constructor(id: string, name: string, authRules: string[]) {
        this.id = id;
        this.name = name;
        authRules.forEach(rule => {
            this.AuthRules.push(rule)
        });
    }

    addAuthRule(rule: string, authRule: string) {
        return null;
    }
    removeAuthRule(rule: string){
        return null;
    }
    updateAuthRule(rule: string, ...updates: string[]){
        return null;
    }
}