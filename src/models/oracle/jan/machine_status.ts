import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { JanEmployeeMasterModel } from './employee_master';
import { MachineMasterModel } from './machine_master';
import { MachineProcessModel } from './machine_process';
import { ScheduleRequirementModel } from './schedule_requirement';
import { JanStatusReasonModel } from './status_reason';


export class MachineStatusModel extends Model<InferAttributes<MachineStatusModel>, InferCreationAttributes<MachineStatusModel>>{
    declare id: CreationOptional<number>;
    declare REQ_ID: ForeignKey<ScheduleRequirementModel['REQ_ID']>;
    declare DEPARTMENT_CODE: CreationOptional<string>; // process
    declare MACHINE_CODE: ForeignKey<MachineMasterModel['MACHINE_CODE']>; // process
    // tool
    // operator id
    declare COMPLETED_QTY: CreationOptional<number>;
    declare STATUS: CreationOptional<string>;
    declare ENDED_AT: CreationOptional<Date>;
    declare MACHINE_PROCESS_ID: ForeignKey<MachineProcessModel['id']>
    declare REASON: CreationOptional<string>;
    declare OPERATOR: ForeignKey<JanEmployeeMasterModel['EMPLOYEE_NO']>; // process
    declare createdAt?: CreationOptional<Date>;
    declare CREATED_BY?: CreationOptional<String>
}

MachineStatusModel.init(
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
        DEPARTMENT_CODE: {
            type: DataTypes.STRING(10)
        },
        COMPLETED_QTY: {
            type: DataTypes.NUMBER
        },
        STATUS: {
            type: DataTypes.STRING
        },
        MACHINE_PROCESS_ID: {
            type: DataTypes.NUMBER
        },
        REASON: {
            type: DataTypes.STRING
        },
        ENDED_AT: {
            type: DataTypes.DATE
        },
        CREATED_BY: {
            type: DataTypes.STRING
        },
        OPERATOR: {
            type: DataTypes.STRING(500)
        }
    }, {
    sequelize: pool,
    tableName: 'JAN_MACHINE_STATUS',
    freezeTableName: true,
    timestamps: true
});

MachineStatusModel.hasMany(JanStatusReasonModel, {
    as: 'reasons',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'id',
    foreignKey: 'STATUS_ID'
});

JanStatusReasonModel.belongsTo(MachineStatusModel, {
    as: 'status',
    foreignKeyConstraint: false,
    constraints: false,
    targetKey: 'id',
    foreignKey: 'STATUS_ID'
})

MachineStatusModel.hasOne(MachineMasterModel, {
    as: 'machine',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'MACHINE_CODE',
    foreignKey: 'MACHINE_CODE'
})

MachineStatusModel.hasOne(JanEmployeeMasterModel, {
    as: 'operator',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'OPERATOR',
    foreignKey: 'EMPLOYEE_NO'
})