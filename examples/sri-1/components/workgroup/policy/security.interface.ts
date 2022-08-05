
export interface ISecurity {
    id: string;
    name: string;
    AuthRules: string[];
    addAuthRule(rule: string, authRule: string);
    removeAuthRule(rule: string);
    updateAuthRule(rule: string, ...updates: string[]);
    
}