import { JanReason } from '@models';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { BatchProcessQtyModel } from './batch_process_qty';
import { JanEmployeeMasterModel } from './employee_master';
import { MachineMasterModel } from './machine_master';
import { MachineProcessModel } from './machine_process';
import { MachineStatusModel } from './machine_status';
import { JanReasonModel } from './reason';


export class JanStatusReasonModel extends Model<InferAttributes<JanStatusReasonModel>, InferCreationAttributes<JanStatusReasonModel>>{
    declare id: CreationOptional<number>;
    declare REASON_ID: ForeignKey<JanReasonModel['LOSS_CODE']>;
    declare REQ_ID: CreationOptional<number>; // process
    declare MACHINE_CODE: ForeignKey<MachineMasterModel['MACHINE_CODE']>; // process
    declare DEPARTMENT_CODE: CreationOptional<string>; // process
    declare STATUS_ID: ForeignKey<MachineStatusModel['id']>;
    declare QTY_ID: ForeignKey<BatchProcessQtyModel['id']>;
    declare REJ_ID: ForeignKey<BatchProcessQtyModel['id']>; // rejected qty has reason
    declare MACHINE_PROCESS_ID: ForeignKey<MachineProcessModel['id']>
    declare OPERATOR: ForeignKey<JanEmployeeMasterModel['EMPLOYEE_NO']>; // process
    declare reason?: JanReason
}

JanStatusReasonModel.init(
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
        MACHINE_PROCESS_ID: {
            type: DataTypes.NUMBER
        },
        QTY_ID: {
            type: DataTypes.NUMBER
        },
        REASON_ID: {
            type: DataTypes.STRING(500)
        },
        OPERATOR: {
            type: DataTypes.STRING(500)
        }
    }, {
    sequelize: pool,
    tableName: 'JAN_STATUS_REASON',
    freezeTableName: true,
    timestamps: true
});

JanStatusReasonModel.hasOne(JanReasonModel, {
    as: 'reason',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'REASON_ID',
    foreignKey: 'id'
})