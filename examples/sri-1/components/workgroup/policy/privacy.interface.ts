
export interface IPrivacy {
    id: string;
    name: string;
    dataVisibilityRoles: Map<string, string>;
    addDataVisibilityRole(role: string, roleName: string, visibilityLevel: string);
    removeDataVisibilityRole(requestorId: string, roleName: string);
    updateDatavisibilityRole(role: string, ...updates: string[]);
}