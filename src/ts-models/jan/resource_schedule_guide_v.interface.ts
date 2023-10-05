
export interface ResourceScheduleGuideV {
    REQ_ID: number;
    REQ_DATE: string;
    TARGET_DATE: string;
    REQUIREMENT_QTY: string;
    ITEM_NO: string;
    DESCRIPTION: string;
    OPN_SEQ: number;
    DEPARTMENT_CODE: string;
    LOT: string;
    CYCLE_TIME: string;
    SETTING_TIME?: number;
    SETTING_UOM?: string;
    UOM: string;
    RESOURCE_CODE: string;
    MACHINE_NAME: string;
    BOM_TYPE: string;
    ROUTING_TYPE: string;
    LEAD_TIME: number;
    NO_OF_TOOLS: number;
    GROUP_ID: string;
    NO_OF_OPERATORS: number;
}