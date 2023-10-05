import { JanEmployeeDepartment } from "./jan_employee_department.interface";

export interface JanEmployee { 
    SNO: number;
    EMPLOYEE_NO: string;
    EMPLOYEE_NAME: string;
    CATEGORY: string;
    departments?: JanEmployeeDepartment[]
}