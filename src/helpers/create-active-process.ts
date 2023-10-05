import { STATUS_TYPE } from "@models"
import { ActiveMachineProcessModel } from "@oracle-models/jan/active_machine_process"
import { MachineProcessModel } from "@oracle-models/jan/machine_process"
import { MachineStatusModel } from "@oracle-models/jan/machine_status"

export const createActiveProcess = async (params: {
    MACHINE_CODE,
    DEPARTMENT_CODE?, REQ_ID?, SHIFT_TARGET?, OPERATOR?, createdAt?, setActiveProcess?
}) => {
    // create process
    const setActiveProcess = params.setActiveProcess === null || params.setActiveProcess === undefined ? true : params.setActiveProcess
    const payload = {
        MACHINE_CODE: params.MACHINE_CODE,
        DEPARTMENT_CODE: params.DEPARTMENT_CODE || null,
        REQ_ID: params.REQ_ID || null,
        SHIFT_TARGET: params.SHIFT_TARGET || null,
        OPERATOR: params.OPERATOR || null,
        START: new Date()
    }

    if (params.createdAt) {
        payload['createdAt'] = params.createdAt
        payload['START'] = params.createdAt
    }

    const createdMachineProcess = await MachineProcessModel.create(payload)
    const MACHINE_PROCESS_ID = createdMachineProcess.id
    // set active process
    if (setActiveProcess) {
        const machineExists = await ActiveMachineProcessModel.findOne({ where: { MACHINE_CODE: params.MACHINE_CODE } })
        if (machineExists) {
            machineExists.MACHINE_PROCESS_ID = MACHINE_PROCESS_ID
            await machineExists.save()
        } else {
            await ActiveMachineProcessModel.create({ MACHINE_CODE: params.MACHINE_CODE, MACHINE_PROCESS_ID })
        }
    }

    return createdMachineProcess
}

export const createStatus = async (processInfo: { id: number, MACHINE_CODE, REQ_ID, DEPARTMENT_CODE, OPERATOR }, STATUS: STATUS_TYPE, startDate?, endDate?, createdBy?: string) => {

    const payload = {
        MACHINE_PROCESS_ID: processInfo.id, STATUS,
        MACHINE_CODE: processInfo.MACHINE_CODE, REQ_ID: processInfo.REQ_ID,
        DEPARTMENT_CODE: processInfo.DEPARTMENT_CODE,
        OPERATOR: processInfo.OPERATOR
    }

    if (startDate) {
        payload['createdAt'] = startDate
    }

    if (endDate) {
        payload['ENDED_AT'] = endDate
    }

    if (createdBy) {
        payload['CREATED_BY'] = createdBy
    }

    return await MachineStatusModel.create(payload)
}