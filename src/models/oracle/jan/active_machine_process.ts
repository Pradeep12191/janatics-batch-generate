import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { MachineMasterModel } from './machine_master';
import { MachineProcessModel } from './machine_process';


// get the active machine process  or get the latest created machine process
// also stores any additional info on machine
export class ActiveMachineProcessModel extends Model<InferAttributes<ActiveMachineProcessModel>, InferCreationAttributes<ActiveMachineProcessModel>>{
    declare MACHINE_CODE: ForeignKey<MachineMasterModel['MACHINE_CODE']>; // process
    declare MACHINE_PROCESS_ID: ForeignKey<MachineProcessModel['id']>; // process
    declare ALARM: boolean; // process
}

ActiveMachineProcessModel.init(
    {
        MACHINE_CODE: {
            type: DataTypes.STRING
        },
        MACHINE_PROCESS_ID: {
            type: DataTypes.NUMBER
        },
        ALARM: {
            type: DataTypes.BOOLEAN
        }
    },
    {
        sequelize: pool,
        tableName: 'JAN_ACTIVE_MACHINE_PROCESS',
        freezeTableName: true,
        timestamps: true
    });

ActiveMachineProcessModel.hasOne(MachineProcessModel, {
    as: 'process',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'MACHINE_PROCESS_ID',
    foreignKey: 'id'
});

MachineProcessModel.belongsTo(ActiveMachineProcessModel, {
    as: 'machineProcess',
    foreignKeyConstraint: false,
    constraints: false,
    targetKey: 'MACHINE_PROCESS_ID',
    foreignKey: 'id'
});