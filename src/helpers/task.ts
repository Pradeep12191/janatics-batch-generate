const momenttz = require('moment-timezone');
import { ActiveMachineProcessModel } from '@oracle-models/jan/active_machine_process';
import { JanEmployeeMasterModel } from '@oracle-models/jan/employee_master';
import { MachineProcessModel } from '@oracle-models/jan/machine_process';
import { ScheduleRequirementModel } from '@oracle-models/jan/schedule_requirement';
import { sendLive } from './socket';
import { sendLatestInfoLiveNew } from './get-machine-latest-info';
const timeFormat = 'DD/MM/YYYY hh:mm A';
import cron, { schedule } from 'node-cron';
import { MachineMasterModel } from '@oracle-models/jan/machine_master';
import { pool } from '../util/database';
import OracleDB, { NUMBER } from "oracledb";
import { BatchGenerateMonitorModel } from '@oracle-models/jan/batch_generate_monitor';
import { Op } from 'sequelize';

export const tasks = {
    scheduleBatchGenerate: (machine_code: string) => {
        return cron.schedule('*/2 * * * *', async () => {

            await runBatchMonitor(machine_code)
            // await SyncScheduleGuideFromView();
        }, {
            timezone: 'Asia/Kolkata',
            // scheduled: false
        })
    }
}

export const initSchedule = async () => {
    const machines = await MachineMasterModel.findAll({ raw: true });
    let machineIndex = 0;
    for (const machine of machines) {
        const delay = machineIndex * 2
        const schedule = tasks.scheduleBatchGenerate(machine.MACHINE_CODE)
        setTimeout(async () => {
            await runBatchMonitor(machine.MACHINE_CODE)
            schedule.start()
        }, delay * 10 * 1000);
        machineIndex++;
    }
}

export const runBatchMonitor = async (machine_code: string) => {
    console.log('running batch monitor for machine - ', machine_code)
    const batchMonitors = await BatchGenerateMonitorModel.findAll({
        where: {
            MACHINE_CODE: machine_code,
            [Op.or]: [{ QTY_TBL_CHANGED: true }, { REJ_QTY_TBL_CHANGED: true }, { REJ_REASONS_TBL_CHANGED: true }]
        }
    })

    for (const batchMonitor of batchMonitors) {
        if (batchMonitor.REJ_REASONS_TBL_CHANGED && !batchMonitor.QTY_TBL_CHANGED && !batchMonitor.REJ_QTY_TBL_CHANGED) {
            batchMonitor['isOnlyRejReasonChanged'] = true
        }
        batchMonitor.QTY_TBL_CHANGED = false;
        batchMonitor.REJ_QTY_TBL_CHANGED = false;
        await batchMonitor.save();
    }
    for (const batchMonitor of batchMonitors) {
        console.log(`executing batch generate for REQ_ID: ${batchMonitor.REQ_ID} Department: ${batchMonitor.DEPARTMENT_CODE}`)
        if (batchMonitor['isOnlyRejReasonChanged']) {
            await executeWorkOrdersOnly({
                REQ_ID: batchMonitor.REQ_ID, DEPARTMENT_CODE: batchMonitor.DEPARTMENT_CODE
            })
        } else {
            await executeBatchGenerate({
                REQ_ID: batchMonitor.REQ_ID, DEPARTMENT_CODE: batchMonitor.DEPARTMENT_CODE
            })
        }
    }
}

const executeBatchGenerate = async ({ REQ_ID, DEPARTMENT_CODE }) => {
    const binds = {
        REQ_ID: { dir: OracleDB.BIND_IN, type: NUMBER, val: REQ_ID },
        DEPARTMENT_CODE: { dir: OracleDB.BIND_IN, type: NUMBER, val: DEPARTMENT_CODE },
    }
    let connection: OracleDB.Connection;
    connection = await pool.connectionManager.getConnection({ type: 'read' }) as OracleDB.Connection;
    try {
        await connection.execute<{ ret: any }>(`
        BEGIN
            WORK_ORDER_GEN_PCKG.SP_GENERATE_BATCHES(:REQ_ID, :DEPARTMENT_CODE);
        END;`
            , binds)
    }
    catch (err) {
        console.error(err)
    } finally {
        if (connection) {
            console.log('releasing connection')
            await pool.connectionManager.releaseConnection(connection);
        }
    }
}

const executeWorkOrdersOnly = async ({ REQ_ID, DEPARTMENT_CODE }) => {
    const binds = {
        REQ_ID: { dir: OracleDB.BIND_IN, type: NUMBER, val: REQ_ID },
        DEPARTMENT_CODE: { dir: OracleDB.BIND_IN, type: NUMBER, val: DEPARTMENT_CODE },
    }
    let connection: OracleDB.Connection;
    try {
        await connection.execute<{ ret: any }>(`
        BEGIN
            WORK_ORDER_GEN_PCKG.SP_GEN_WORK_ORDERS(:REQ_ID, :DEPARTMENT_CODE);
        END;`
            , binds)
    }
    catch (err) {
        console.error(err)
    } finally {
        if (connection) {
            console.log('releasing connection')
            await pool.connectionManager.releaseConnection(connection);
        }
    }
}