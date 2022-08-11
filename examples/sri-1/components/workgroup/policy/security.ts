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

    //TODO construct implementation of substitute Auth rules or import Auth library for current scope purposes
    addAuthRule(rule: string, authRule: string) {};
    removeAuthRule(rule: string) {};
    updateAuthRule(rule: string, ...updates: string[]) {};
}