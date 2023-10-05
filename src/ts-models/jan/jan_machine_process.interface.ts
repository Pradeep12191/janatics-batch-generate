import { AcScheduleRequirementOrder } from "./ac_schedule_requirement_order.interface";
import { JanEmployee } from "./jan_employee.interface";
import { JanMachineMaster } from "./machine_master.interface";
import { JanScheduleRequirement } from "./schedule_requirement.interface";

export type JanMachineStatus = {
    id: number;
    REQ_ID: number;
    MACHINE_CODE: string;
    DEPARTMENT_CODE: string;
    OPERATOR: string;
    STATUS: STATUS_TYPE;
    MACHINE_PROCESS_ID: number;
    createdAt: any;
    machine: JanMachineMaster;
    operator: JanEmployee;
    ENDED_AT;
}

export type STATUS_TYPE = 'running' | 'completed' | 'hold' | 'skip' | 'idle' | 'setup'

export interface ActiveMachineInfo {
    MACHINE_CODE: string;
    total: number;
    okQty: number;
    rejQty: number;
    requirement: JanScheduleRequirement;
    workOrders: any[];
    activeWorkOrder: any;
    scheduleOrder: AcScheduleRequirementOrder;
    runningStatus: JanMachineStatus[];
    process: JanMachineProcess;
    status: JanMachineStatus;
    isProductionCompleted: boolean;
    activeProcess: JanActiveMachineProcess;
    losses: JanMachineStatus[];
    productionTarget: number;
    completedReq: number;
    hourlyProduction: {
        time: { start, end },
        totalQty: number, totalOkQty: number, totalRejQty: number,
        eff: number, lossDuration: number, hourTarget: number
    }[];
    isLive?: boolean;
}


export interface ScheduleSkipped {
    REQ_ID: number;
    isSkipped: boolean;
}

export interface ToolAvailableEntity {
    isAvailable: boolean,
    usedMachines?: JanMachineMaster[];
    itemNo: string;
    departmentCode: string;
    reqId: number;
}

export interface JanMachineProcess {
    id: number;
    REQ_ID: number;
    MACHINE_CODE: string;
    DEPARTMENT_CODE: string;
    START: string;
    END: string;
    OPERATOR: string;
    SHIFT_TARGET: number;
    requirement: JanScheduleRequirement;
    createdAt;
    operator?: JanEmployee;
    machine: JanMachineMaster;
}

export interface JanActiveMachineProcess {
    MACHINE_CODE: string, MACHINE_PROCESS_ID: number,
    ALARM: boolean;
    process: JanMachineProcess
}