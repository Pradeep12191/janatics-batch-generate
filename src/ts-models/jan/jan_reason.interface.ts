export interface JanReason {
    LOSS_CODE: string;
    DESCRIPTION: string;
    LOSS_CODE_GROUP: string;
    DEPT: string;
    CATEGORY: string;
}

export interface JanReasonCategory {
    LOSS_CODE_GROUP: string;
    // CATEGORY: string;
}

export interface JanStatusReason {
    id?: number;
    REASON_ID: string;
    STATUS_ID?: number; // hold and shift target not achieved reason
    QTY_ID?: number; // not used
    REJ_ID?: number // if reason stored for qty (rejection)
    MACHINE_PROCESS_ID: number;
    REQ_ID: number;
    MACHINE_CODE: string;
    DEPARTMENT_CODE: string;
    OPERATOR: string; //employee_no
    reason?: JanReason
}
// hold or breakdown
export type JanReasonType = 'shortage' | 'hold' | 'reject'