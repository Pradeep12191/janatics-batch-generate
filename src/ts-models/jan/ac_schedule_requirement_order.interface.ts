import { ResourceScheduleGuideV } from "./resource_schedule_guide_v.interface";
import { JanScheduleRequirement } from "./schedule_requirement.interface";

export interface AcScheduleRequirementOrder {
    REQ_ID: number;
    id: number;
    requirement: JanScheduleRequirement,
    isCompleted: boolean;
    productDescription: string;
    order: number; // should be workorder, if workorder is seq no of schedule
    orderChangedOn: Date,
    processes?: ResourceScheduleGuideV[];
}