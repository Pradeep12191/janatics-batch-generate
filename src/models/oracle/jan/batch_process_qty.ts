import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { JanEmployeeMasterModel } from './employee_master';
import { MachineMasterModel } from './machine_master';
import { MachineProcessModel } from './machine_process';
import { MachineStatusModel } from './machine_status';
import { ScheduleRequirementModel } from './schedule_requirement';
import { RejectQtyModel } from './reject_qty';
import { JanScheduleRequirement } from '@models';


export class BatchProcessQtyModel extends Model<InferAttributes<BatchProcessQtyModel>, InferCreationAttributes<BatchProcessQtyModel>>{
    declare id: CreationOptional<number>;
    declare REQ_ID: ForeignKey<ScheduleRequirementModel['REQ_ID']>;
    // declare BATCH_ID: ForeignKey<ScheduleBatchActualModel['id']>;
    declare MACHINE_PROCESS_ID: ForeignKey<MachineProcessModel['id']>;
    declare MACHINE_STATUS_ID: ForeignKey<MachineStatusModel['id']>;
    // department code and machine code can get from batch process - but still storing here also for safer side - mostly dont use directly
    declare DEPARTMENT_CODE: CreationOptional<string>; // process
    declare MACHINE_CODE: ForeignKey<MachineMasterModel['MACHINE_CODE']>; // process
    declare SHIFT_NO?: CreationOptional<number>;
    declare SHIFT_DATE?: CreationOptional<Date>;
    declare SHIFT_DATE_FORMATTED?: CreationOptional<string>;
    // Qty
    declare OK_QTY: CreationOptional<number>; // 10, 12
    // declare REJ_QTY: CreationOptional<number>; // 2, 0
    declare OPERATOR: ForeignKey<JanEmployeeMasterModel['EMPLOYEE_NO']>; // process
    declare ENTERED_AT: CreationOptional<Date>; // process
    declare ENTERED_BY: CreationOptional<string>; // 'board' | 'manual' - default 'manual' if no value
    declare rejects?: { QTY: number, REASONS: number[] }[];
    declare isShortageCalculated: boolean;
    declare createdAt?: Date;
    declare schedule?: JanScheduleRequirement
}

BatchProcessQtyModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        REQ_ID: {
            type: DataTypes.NUMBER
        },
        MACHINE_CODE: {
            type: DataTypes.STRING
        },
        OPERATOR: {
            type: DataTypes.STRING(500)
        },
        DEPARTMENT_CODE: {
            type: DataTypes.STRING(10)
        },
        MACHINE_PROCESS_ID: {
            type: DataTypes.NUMBER
        },
        MACHINE_STATUS_ID: {
            type: DataTypes.NUMBER
        },
        OK_QTY: {
            type: DataTypes.NUMBER
        },
        ENTERED_AT: {
            type: DataTypes.DATE
        },
        ENTERED_BY: {
            type: DataTypes.STRING(10)
        },
        isShortageCalculated: {
            type: DataTypes.BOOLEAN
        },
        SHIFT_NO: DataTypes.NUMBER,
        SHIFT_DATE: DataTypes.DATEONLY,
        SHIFT_DATE_FORMATTED: DataTypes.STRING,
    }, {
    sequelize: pool,
    tableName: 'JAN_BATCH_PROCESS_QTY',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            fields: ['DEPARTMENT_CODE', 'REQ_ID']
        },
        {
            fields: ['MACHINE_PROCESS_ID']
        },
        {
            fields: ['ENTERED_AT', 'MACHINE_CODE']
        },
        {
            fields: ['MACHINE_CODE', 'REQ_ID', 'DEPARTMENT_CODE', 'ENTERED_AT']
        },
        {
            fields: ['MACHINE_CODE', 'ENTERED_AT']
        }
    ]
});

BatchProcessQtyModel.hasOne(JanEmployeeMasterModel, {
    as: 'operator',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'OPERATOR',
    foreignKey: 'EMPLOYEE_NO'
})

BatchProcessQtyModel.hasOne(ScheduleRequirementModel, {
    as: 'schedule',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'REQ_ID',
    foreignKey: 'REQ_ID'
})

BatchProcessQtyModel.hasMany(RejectQtyModel, {
    as: 'rejects',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'id',
    foreignKey: 'QTY_ID'
});