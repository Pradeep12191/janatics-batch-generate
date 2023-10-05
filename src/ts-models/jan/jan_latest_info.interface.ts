export interface JanMachineLatestInfo {
    completedReq: number;
    HOURLY_PRODUCTION: DurationType[];
    hourTarget: number;
    LOSSES_AND_RUNS: StatusDetails[];
    PROCESS_DETAILS: ProcessDetails;
    rejQty: number;
    okQty: number;
    total: number;
    MACHINE_CODE: string;
    STATUS: StatusDetails;
    PROCESS_LOT: 'lot' | 'item';
    CYCLE_TIME: number;
    PRODUCT_DESC: string;
    isLive?: boolean;
}

export interface StatusDetails {
    id: number;
    NAME: string;
    createdAt: string;
    ENDED_AT: string;
    REASON_ID: string;
    LOSS_DESC: string;
    REASONS: { CODE: string, DESCRIPTION }[]
}

export interface ProcessDetails {
    ALARM: boolean;
    createdAt: string;
    DEPARTMENT_CODE: string;
    START: string;
    END: string;
    IS_COMPLETED: boolean;
    ITEM_NO: string;
    MACHINE_CODE: string;
    MACHINE_PROCESS_ID: number;
    OPERATOR_NAME: string;
    OPERATOR_NO: string;
    PRIORITY: number;
    REQ_ID: number;
    REQUIREMENT: number;
    SHIFT_TARGET: number;
}

export interface DurationType {
    END_TIME: string;
    HOUR_TARGET: number;
    START_TIME: string;
    TOTAL_OK_QTY: number;
    TOTAL_QTY: number;
    TOTAL_REJ_QTY: number;
    EFF: number;
}