export interface JanEmployeeDepartment {
    EMPLOYEE_NO: string;
    DEPARTMENT: string;
    accessType?: JanDepartmentAccessType;
}

export type JanDepartmentAccessType =  'supervisor' | 'inspector' | null