import { BatchProcessQtyModel } from "@oracle-models/jan/batch_process_qty";
import { JanEmployeeMasterModel } from "@oracle-models/jan/employee_master";
import { MachineMasterModel } from "@oracle-models/jan/machine_master";
import { MachineProcessModel } from "@oracle-models/jan/machine_process";
import { MachineStatusModel } from "@oracle-models/jan/machine_status";
import { Op, where } from "sequelize";
import { getActiveShift } from "./get-shift-days";
import { qtyIncludes } from "./populate";
import { round } from "./utils";
import { RejectQtyModel } from "@oracle-models/jan/reject_qty";

export const getLatestMachineStatus = async (machineCode, reqId?, departmentCode?, status?: string[]) => {

    const whereClause = {
        MACHINE_CODE: machineCode
    }

    if (reqId) {
        whereClause['REQ_ID'] = reqId
    }

    if (departmentCode) {
        whereClause['DEPARTMENT_CODE'] = departmentCode
    }

    if (status) {
        whereClause['STATUS'] = status
    }

    const latestMachineStatus = await MachineStatusModel.findOne({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: 1
    });
    return latestMachineStatus
}

export const getLatestMachineStatusExceptSkip = async (machineCode, reqId?, departmentCode?) => {

    const whereClause = {
        MACHINE_CODE: machineCode,
        STATUS: { [Op.notIn]: ['skip'] }
    }

    if (reqId) {
        whereClause['REQ_ID'] = reqId
    }

    if (departmentCode) {
        whereClause['DEPARTMENT_CODE'] = departmentCode
    }

    const latestMachineStatus = await MachineStatusModel.findOne({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        // limit: 1
    });
    return latestMachineStatus
}

export const getLatestMachineProcess = async (machineCode, reqId?, departmentCode?) => {
    const machineProcess = await MachineProcessModel.findOne({
        where: { MACHINE_CODE: machineCode, REQ_ID: reqId, DEPARTMENT_CODE: departmentCode },
        order: [['createdAt', 'DESC']],
        limit: 1
    });
    return machineProcess
}

export const getLatestProcessStatus = async (MACHINE_PROCESS_ID, excludeStatus = []) => {
    const latestMachineStatus = await MachineStatusModel.findOne({
        where: { MACHINE_PROCESS_ID, STATUS: { [Op.notIn]: [...excludeStatus, 'skip'] } },
        order: [['createdAt', 'DESC']],
        limit: 1,
        include: [
            { model: MachineMasterModel, as: 'machine' },
            { model: JanEmployeeMasterModel, as: 'operator' }
        ]
    });
    return latestMachineStatus
}

export const getFirstStatusForProcess = async (MACHINE_PROCESS_ID, status) => {
    return await MachineStatusModel.findOne({
        where: {
            MACHINE_PROCESS_ID,
            STATUS: { [Op.in]: [status] },
        },
        order: [['createdAt', 'ASC']],
        limit: 1,
    })
}

export const getLosess = async (MACHINE_PROCESS_ID) => {
    return await MachineStatusModel.findAll({
        where: {
            MACHINE_PROCESS_ID,
            STATUS: { [Op.in]: ['hold', 'idle'] },
            // [Op.or]: [
            //     {
            //         CREATED_BY: { [Op.ne]: 'timer' }
            //     },
            //     {
            //         CREATED_BY: null
            //     }
            // ]
        },
        raw: true,
        order: [['createdAt', 'ASC']]
    })
}

export const getHourlyProduction = async (processInfo: MachineProcessModel, hourTarget, losses: MachineStatusModel[]) => {
    const { currentShift: activeShift } = await getActiveShift(new Date(processInfo.createdAt));
    let endTime = new Date() < activeShift.end ? new Date() : activeShift.end
    let startTime = activeShift.start

    if (processInfo.START && processInfo.END) {
        endTime = new Date(processInfo.END)
        startTime = new Date(processInfo.START)
    }

    const qtys = await BatchProcessQtyModel.findAll({
        where: {
            ENTERED_AT: {
                [Op.between]: [startTime, endTime]
            },
            MACHINE_CODE: processInfo.MACHINE_CODE
        }, include: qtyIncludes
    })

    const totalDuration = ((endTime as any) - (startTime)) / (1000 * 60);
    const durations = []

    const noOfSlice = Math.ceil(totalDuration / 60)

    const initial = activeShift.start.valueOf()
    for (let s = 0; s < noOfSlice; s++) {
        const startMin = (s * 60) * (60 * 1000)
        const endMin = ((s * 60) + 60) * (60 * 1000);
        const start = new Date(initial + (startMin));
        const end = new Date((initial + endMin));
        const hourQtys = qtys.filter(qty => {
            const qtyDate = new Date(qty.ENTERED_AT)
            return qtyDate >= start && qtyDate <= end
        })
        let totalOkQty = 0;
        let totalRejQty = 0;
        const products = []
        const totalHourQty = hourQtys.reduce((acc, qty) => {
            const rejQty = qty.rejects.reduce((rejectAcc, reject) => {
                rejectAcc += +reject.QTY || 0
                return rejectAcc
            }, 0)
            if (!products.includes(qty.schedule?.ITEM_NO)) {
                products.push(qty.schedule?.ITEM_NO)
            }
            totalOkQty += qty.OK_QTY
            totalRejQty += rejQty
            acc += (rejQty + qty.OK_QTY)
            return acc
        }, 0)
        const eff = (totalHourQty / hourTarget) * 100
        // for(const l)
        durations.push({
            time: { start, end },
            totalQty: totalHourQty,
            totalOkQty,
            totalRejQty,
            eff: round(eff),
            hourTarget,
            products
        })
    }

    const clonedLosses = losses.map(loss => ({ ...loss }))

    for (let d = 0; d < durations.length; d++) {
        const duration = durations[d];
        let lossDuration = 0;
        for (let l = 0; l < clonedLosses.length; l++) {
            const loss = clonedLosses[l]
            const lossStartedAt = new Date(loss.createdAt)
            const lossEndedAt = loss.ENDED_AT ? new Date(loss.ENDED_AT) : null
            // both lossStartedAt and lossEndedAt within start and end duration
            if (lossEndedAt) {
                if (lossStartedAt >= duration.time.start) {
                    if (lossEndedAt <= duration.time.end) {
                        lossDuration += ((lossEndedAt.valueOf() - lossStartedAt.valueOf()) / (1000 * 60))
                    }

                    if (lossEndedAt > duration.time.end) {
                        lossDuration += ((duration.time.end.valueOf() - lossStartedAt.valueOf()) / (1000 * 60))
                        loss.createdAt = duration.time.end;
                        // continue the same loss for next duration
                        // l--
                    }
                } else {
                    // loss started at less than start
                }
            } else {
                // end time not yet generated 
            }

        }
        duration.lossDuration = lossDuration
    }

    return durations
}

export const getCompletedQtyForShift = async (machineProcessId) => {
    const okQty = await BatchProcessQtyModel.sum('OK_QTY', { where: { MACHINE_PROCESS_ID: machineProcessId } })
    const rejQty = await RejectQtyModel.sum('QTY', { where: { MACHINE_PROCESS_ID: machineProcessId } })
    const total = okQty + rejQty
    return { total, okQty, rejQty }
}

export const shiftTargetQty = async (cycleTime) => {
    if (cycleTime) {
        const { currentShift: activeShift } = await getActiveShift(new Date())
        // consider from current time to shift end
        const shiftDuration = (new Date(activeShift.end) as any) - (new Date(activeShift.start) as any)
        const shiftDurationInMin = shiftDuration / (60 * 1000)
        const qtyPerHr = Math.round(1 / +cycleTime)
        const qtyPerMin = qtyPerHr / 60
        const targetQty = Math.floor(shiftDurationInMin * qtyPerMin)
        // const remainingQty = requiredQty - completedQty
        // if (remainingQty < targetQty) {
        //     return remainingQty
        // }
        return targetQty
    }
    return 0
}