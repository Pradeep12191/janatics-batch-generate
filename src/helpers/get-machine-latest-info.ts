
import { sendLive } from "./socket";
import { DurationType, JanMachineLatestInfo, ProcessDetails, StatusDetails } from "@models";
import OracleDB, { NUMBER, STRING, } from "oracledb";
import { pool } from "../util/database";


export const takeMachineLatestInfoCursor = async (MACHINE_CODE: string, config?: { isHourlyProduction?: boolean, isRunsAndLoss?: boolean }) => {
    let connection: OracleDB.Connection;
    try {
        connection = await pool.connectionManager.getConnection({ type: 'read' }) as OracleDB.Connection;
        config = config || {}
        let isHourlyProduction = config.isHourlyProduction;
        let isRunsAndLoss = config.isRunsAndLoss;
        const binds = {
            machineCode: { dir: OracleDB.BIND_IN, type: NUMBER, val: MACHINE_CODE },
            ret: { dir: OracleDB.BIND_OUT, type: OracleDB.CURSOR },
            processDetailsCur: { dir: OracleDB.BIND_OUT, type: OracleDB.CURSOR },
            statusCur: { dir: OracleDB.BIND_OUT, type: OracleDB.CURSOR },
            hourlyProdCur: { dir: OracleDB.BIND_OUT, type: OracleDB.CURSOR },
            lossesAndRunsCur: { dir: OracleDB.BIND_OUT, type: OracleDB.CURSOR },
            isHourlyProduction: { dir: OracleDB.BIND_IN, type: OracleDB.DB_TYPE_CHAR, val: isHourlyProduction ? '1' : '0' },
            isRunsAndLoss: { dir: OracleDB.BIND_IN, type: OracleDB.DB_TYPE_CHAR, val: isRunsAndLoss ? '1' : '0' }
        }

        const plsql = `
        BEGIN
            :ret := LATEST_INFO_PCKG_CURSOR.GET_MACHINE_LATEST_DETAILS(:machineCode, :processDetailsCur, :statusCur, :hourlyProdCur, :lossesAndRunsCur, :isHourlyProduction, :isRunsAndLoss);
        END;`
        const result = await connection.execute<any>(plsql, binds)
        const payload: Partial<JanMachineLatestInfo> = {
        }
        if (result.outBinds.ret) {
            const latestDetails = await result.outBinds.ret.getRows(1);
            if (latestDetails[0]) {
                const latestDetail = latestDetails[0];
                payload.MACHINE_CODE = latestDetail[0];
                payload.completedReq = latestDetail[1];
                payload.hourTarget = latestDetail[2];
                payload.okQty = latestDetail[3];
                payload.rejQty = latestDetail[4];
                payload.CYCLE_TIME = latestDetail[5];
                payload.PROCESS_LOT = latestDetail[6];
                payload.PRODUCT_DESC = latestDetail[7];
                payload.total = latestDetail[8];
            }
            await result.outBinds.ret.close();
        }
        if (result.outBinds.processDetailsCur) {
            const processDetails = await result.outBinds.processDetailsCur.getRows(1);
            if (processDetails[0]) {
                const processDetail = processDetails[0]
                const PROCESS_DETAILS: Partial<ProcessDetails> = {}
                PROCESS_DETAILS.ALARM = !!(+processDetail[0])
                PROCESS_DETAILS.MACHINE_PROCESS_ID = processDetail[1];
                PROCESS_DETAILS.MACHINE_CODE = processDetail[2];
                PROCESS_DETAILS.REQ_ID = processDetail[3];
                PROCESS_DETAILS.DEPARTMENT_CODE = processDetail[4];
                PROCESS_DETAILS.START = processDetail[5];
                PROCESS_DETAILS.END = processDetail[6];
                PROCESS_DETAILS.createdAt = processDetail[7];
                PROCESS_DETAILS.OPERATOR_NO = processDetail[8];
                PROCESS_DETAILS.OPERATOR_NAME = processDetail[9];
                PROCESS_DETAILS.REQUIREMENT = processDetail[10];
                PROCESS_DETAILS.ITEM_NO = processDetail[11];
                PROCESS_DETAILS.IS_COMPLETED = !!(+processDetail[12]);
                PROCESS_DETAILS.PRIORITY = processDetail[13];
                PROCESS_DETAILS.SHIFT_TARGET = processDetail[14];
                payload.PROCESS_DETAILS = PROCESS_DETAILS as ProcessDetails;
            }
            await result.outBinds.processDetailsCur.close();
        }
        if (result.outBinds.statusCur) {
            const res = await result.outBinds.statusCur.getRows(1);
            if (res[0]) {
                const statusDetail = res[0];
                if (statusDetail) {
                    const status: Partial<StatusDetails> = {}
                    status.id = statusDetail[0];
                    status.NAME = statusDetail[1];
                    status.createdAt = statusDetail[1];
                    status.ENDED_AT = statusDetail[2];
                    status.REASON_ID = statusDetail[3];
                    payload.STATUS = status as StatusDetails;
                } else {
                    payload.STATUS = null;
                }

            }
            await result.outBinds.statusCur.close();
        }
        if (result.outBinds.hourlyProdCur && isHourlyProduction) {
            const rows = await result.outBinds.hourlyProdCur.getRows(10);
            const hourlyProds = []
            for (const row of rows) {
                const duration: Partial<DurationType> = {};
                duration.START_TIME = row[0];
                duration.END_TIME = row[1];
                duration.TOTAL_QTY = row[2];
                duration.TOTAL_OK_QTY = row[3];
                duration.TOTAL_REJ_QTY = row[4];
                duration.HOUR_TARGET = row[5];
                duration.EFF = +parseFloat(row[6]).toFixed(2);
                hourlyProds.push(duration)
            }
            payload.HOURLY_PRODUCTION = hourlyProds;
            // console.log('hourly prod', hourlyProds);
            await result.outBinds.hourlyProdCur.close();
        } else if (result.outBinds.hourlyProdCur) {
            await result.outBinds.hourlyProdCur.close();
        }
        if (result.outBinds.lossesAndRunsCur && isRunsAndLoss) {
            const losses = await result.outBinds.lossesAndRunsCur.getRows(50);
            const lossesAndRuns = [];
            for (const row of losses) {
                const status: Partial<StatusDetails> = {};
                status.id = row[0];
                status.NAME = row[1];
                status.createdAt = row[2];
                status.ENDED_AT = row[3];
                status.REASON_ID = row[4];
                status.LOSS_DESC = row[5];

                lossesAndRuns.push(status);
            }
            const lossesAndRunsGrouped = lossesAndRuns.reduce((acc, lossAndRun) => {
                if (acc[lossAndRun.id]) {
                    acc[lossAndRun.id] = {
                        ...acc[lossAndRun.id],
                        REASONS: [
                            ...acc[lossAndRun.id].REASONS,
                            { CODE: lossAndRun.REASON_ID, DESCRIPTION: lossAndRun.LOSS_DESC }
                        ]
                    }
                } else {
                    acc[lossAndRun.id] = {
                        ...lossAndRun,
                        REASONS: lossAndRun.REASON_ID ? [{ CODE: lossAndRun.REASON_ID, DESCRIPTION: lossAndRun.LOSS_DESC }] : []
                    }
                }
                return acc
            }, {})
            payload.LOSSES_AND_RUNS = Object.values(lossesAndRunsGrouped);
            // console.log('losses and runs', lossesAndRuns);
            await result.outBinds.lossesAndRunsCur.close();
        } else if (result.outBinds.lossesAndRunsCur) { 
            await result.outBinds.lossesAndRunsCur.close();
        }
        // await result.outBinds.processDetailsCur.close();
        // await result.outBinds.statusCur.close();
        // await result.outBinds.hourlProdCur.close();
        // await result.outBinds.lossesAndRunsCur.close();
        return payload;
    } catch (error) {
        console.log(error)
    } finally {
        if (connection) {
            // console.log('releasing connection')
            await pool.connectionManager.releaseConnection(connection);
        }
    }
}

export const sendLatestInfoLiveNew = async (MACHINE_CODE, headers = {}, isLive = undefined) => {
    const latestInfo = await takeMachineLatestInfoCursor(MACHINE_CODE, { isHourlyProduction: true, isRunsAndLoss: true });

    if (latestInfo) {
        await sendLive('MachineLatestInfoEvent', 'update', headers, { latestInfo: { ...latestInfo, isLive } })
    } else {
        await sendLive('MachineLatestInfoEvent', 'update', headers, {
            latestInfo: {
                isLive, MACHINE_CODE, status: {}
            }
        })
    }
    return latestInfo
}
