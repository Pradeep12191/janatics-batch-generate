import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { JanEmployeeMasterModel } from './employee_master';
import { MachineMasterModel } from './machine_master';
import { MachineProcessModel } from './machine_process';
import { MachineStatusModel } from './machine_status';
import { ScheduleRequirementModel } from './schedule_requirement';
import { JanStatusReasonModel } from './status_reason';


export class RejectQtyModel extends Model<InferAttributes<RejectQtyModel>, InferCreationAttributes<RejectQtyModel>>{
    declare id: CreationOptional<number>;
    declare REQ_ID: ForeignKey<ScheduleRequirementModel['REQ_ID']>;
    // declare BATCH_ID: ForeignKey<ScheduleBatchActualModel['id']>;
    declare MACHINE_PROCESS_ID: ForeignKey<MachineProcessModel['id']>;
    declare MACHINE_STATUS_ID: ForeignKey<MachineStatusModel['id']>;
    // department code and machine code can get from batch process - but still storing here also for safer side - mostly dont use directly
    declare DEPARTMENT_CODE: CreationOptional<string>; // process
    declare MACHINE_CODE: ForeignKey<MachineMasterModel['MACHINE_CODE']>; // process
    // Qty
    declare QTY: CreationOptional<number>; // 10, 12
    declare QTY_ID: CreationOptional<number>; // 2, 0
    declare OPERATOR: ForeignKey<JanEmployeeMasterModel['EMPLOYEE_NO']>; // process
}

RejectQtyModel.init(
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
        QTY: {
            type: DataTypes.NUMBER
        },
        QTY_ID: {
            type: DataTypes.NUMBER
        }
    }, {
    sequelize: pool,
    tableName: 'JAN_REJECT_QTY',
    freezeTableName: true,
    timestamps: true
});

RejectQtyModel.hasOne(JanEmployeeMasterModel, {
    as: 'operator',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'OPERATOR',
    foreignKey: 'EMPLOYEE_NO'
})

RejectQtyModel.hasMany(JanStatusReasonModel, {
    as: 'reasons',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'id',
    foreignKey: 'REJ_ID'
})

