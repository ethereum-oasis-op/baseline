
export interface IPrivacy {
    dataVisibilityRoles: string[];
    addDataVisibilityRole(role: string, visibilityLevel: string);
    removeDataVisibilityRole(role: string);
    updateDatavisibilityRole(role: string, ...updates: string[]);
    
}