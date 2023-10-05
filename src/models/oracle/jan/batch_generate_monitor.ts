import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { MachineMasterModel } from './machine_master';
import { ScheduleRequirementModel } from './schedule_requirement';


export class BatchGenerateMonitorModel extends Model<InferAttributes<BatchGenerateMonitorModel>, InferCreationAttributes<BatchGenerateMonitorModel>>{
    declare id: CreationOptional<string>;
    declare REQ_ID: ForeignKey<ScheduleRequirementModel['REQ_ID']>;
    declare DEPARTMENT_CODE: CreationOptional<string>; // process
    declare MACHINE_CODE: ForeignKey<MachineMasterModel['MACHINE_CODE']>;
    declare QTY_TBL_CHANGED: CreationOptional<boolean>;
    declare REJ_QTY_TBL_CHANGED: CreationOptional<boolean>;
    declare REJ_REASONS_TBL_CHANGED: CreationOptional<boolean>;
    declare INSPECTION_REASONS_TBL_CHANGED: CreationOptional<boolean>;
}

BatchGenerateMonitorModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
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
        QTY_TBL_CHANGED: {
            type: DataTypes.BOOLEAN
        },
        REJ_QTY_TBL_CHANGED: {
            type: DataTypes.BOOLEAN
        },
        REJ_REASONS_TBL_CHANGED: {
            type: DataTypes.BOOLEAN
        },
        INSPECTION_REASONS_TBL_CHANGED: {
            type: DataTypes.BOOLEAN
        }
    }, {
    sequelize: pool,
    tableName: 'JAN_BATCH_GENERATE_MONITOR',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            fields: ['DEPARTMENT_CODE', 'REQ_ID', 'MACHINE_CODE']
        },
        {
            fields: ['DEPARTMENT_CODE', 'REQ_ID']
        },
    ]
});