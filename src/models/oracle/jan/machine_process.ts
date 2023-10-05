import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { JanEmployeeMasterModel } from './employee_master';
import { MachineMasterModel } from './machine_master';
import { MachineStatusModel } from './machine_status';
import { ScheduleRequirementModel } from './schedule_requirement';


// a new machine process will be created when a schedule is selected
export class MachineProcessModel extends Model<InferAttributes<MachineProcessModel>, InferCreationAttributes<MachineProcessModel>>{
    declare id: CreationOptional<number>;
    declare REQ_ID: ForeignKey<ScheduleRequirementModel['REQ_ID']>;
    declare DEPARTMENT_CODE: CreationOptional<string>; // process
    declare MACHINE_CODE: ForeignKey<MachineMasterModel['MACHINE_CODE']>; // process
    declare OPERATOR: ForeignKey<JanEmployeeMasterModel['EMPLOYEE_NO']>; // process
    declare SHIFT_TARGET: CreationOptional<number> // shift target quantity determined at the time selecting schedule
    declare START?: any
    declare END?: any
    declare createdAt?: any
    // tool
}

MachineProcessModel.init(
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
        OPERATOR: {
            type: DataTypes.STRING(500)
        },
        SHIFT_TARGET: {
            type: DataTypes.NUMBER
        },
        START: {
            type: DataTypes.DATE
        },
        END: {
            type: DataTypes.DATE
        }
    }, {
    sequelize: pool,
    tableName: 'JAN_MACHINE_PROCESS',
    freezeTableName: true,
    timestamps: true
});

MachineProcessModel.hasMany(MachineStatusModel, {
    as: 'status',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'id',
    foreignKey: 'MACHINE_PROCESS_ID'
});

MachineProcessModel.hasOne(JanEmployeeMasterModel, {
    as: 'operator',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'OPERATOR',
    foreignKey: 'EMPLOYEE_NO'
})

MachineProcessModel.hasOne(ScheduleRequirementModel, {
    as: 'requirement',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'REQ_ID',
    foreignKey: 'REQ_ID'
});

MachineProcessModel.hasOne(MachineMasterModel, {
    as: 'machine',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'MACHINE_CODE',
    foreignKey: 'MACHINE_CODE'
});

MachineStatusModel.belongsTo(MachineProcessModel, {
    as: 'machineProcess',
    foreignKeyConstraint: false,
    constraints: false,
    targetKey: 'id',
    foreignKey: 'MACHINE_PROCESS_ID'
});