import { JanEmployeeMasterModel } from "@oracle-models/jan/employee_master";
import { RejectQtyModel } from "@oracle-models/jan/reject_qty";
import { ScheduleRequirementModel } from "@oracle-models/jan/schedule_requirement";
import { JanStatusReasonModel } from "@oracle-models/jan/status_reason";

export const qtyIncludes = [
    {
        model: RejectQtyModel, as: 'rejects', include: [{ model: JanStatusReasonModel, as: "reasons" }]
    },
    {
        model: JanEmployeeMasterModel, as: 'operator'
    },
    {
        model: ScheduleRequirementModel, as: 'schedule'
    }
]