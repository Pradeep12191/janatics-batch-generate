import { ResourceScheduleGuideV } from "./resource_schedule_guide_v.interface";

export interface JanScheduleRequirement {
    REQ_ID: number;
    REQ_DATE: any;
    ORGANIZATION_ID: number;
    INVENTORY_ITEM_ID: number;
    ITEM_NO: string;
    REQUIREMENT: number;
    JOB_RELEASED_QTY: number;
    CANCELLED_QTY: number;
    TARGET_DATE: string;
    SOURCE_ID: number;
    BOM_TYPE: string;
    ROUTING_TYPE: string;
    WIP_ENTITY_ID: string;
    CLOSED_FLAG: string;
    OS_TAG: string;
    OPTIMUM_QTY: number;
    NEW_ITEM_TYPE: string;
    MRP_ID: number;
    GROUP_ID: string;
    LINE_ID: number;
    TARGET_WEEK_NO: number;
    productDescription: string;
    batchCount: number;
    processes?: ResourceScheduleGuideV[];
}