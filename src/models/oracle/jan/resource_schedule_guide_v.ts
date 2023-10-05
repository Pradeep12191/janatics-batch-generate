import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { MachineMasterModel } from './machine_master';


export class ResourceScheduleGuideVModel extends Model<InferAttributes<ResourceScheduleGuideVModel>, InferCreationAttributes<ResourceScheduleGuideVModel>>{
    declare ORGANIZATION_ID: CreationOptional<number>;
    declare INVENTORY_ITEM_ID: CreationOptional<number>;
    declare REQ_ID: CreationOptional<number>;
    declare REQ_DATE: CreationOptional<string>;
    declare TARGET_DATE: CreationOptional<string>;
    declare REQUIREMENT_QTY: CreationOptional<number>;
    declare ITEM_NO: CreationOptional<string>;
    declare DESCRIPTION: CreationOptional<string>;
    declare OPN_SEQ: CreationOptional<number>;
    declare DEPARTMENT_CODE: CreationOptional<string>;
    declare LOT: CreationOptional<string>;
    declare CYCLE_TIME: CreationOptional<number>;
    declare UOM: CreationOptional<string>;
    declare RESOURCE_CODE: CreationOptional<string>;
    declare MACHINE_NAME: CreationOptional<string>;
    declare BOM_TYPE: CreationOptional<string>;
    declare ROUTING_TYPE: CreationOptional<string>;
    declare LEAD_TIME: CreationOptional<number>;
    declare NO_OF_TOOLS: CreationOptional<number>;
    declare GROUP_ID: CreationOptional<string>;
    declare NO_OF_OPERATORS: CreationOptional<number>;
    declare SETTING_TIME?: number;

}

ResourceScheduleGuideVModel.init(
    {
        ORGANIZATION_ID: DataTypes.NUMBER,
        INVENTORY_ITEM_ID: DataTypes.NUMBER,
        REQ_ID: {
            type: DataTypes.NUMBER
        },
        REQ_DATE: DataTypes.STRING,
        TARGET_DATE: DataTypes.STRING,
        REQUIREMENT_QTY: DataTypes.NUMBER,
        ITEM_NO: DataTypes.STRING,
        DESCRIPTION: DataTypes.STRING,
        OPN_SEQ: DataTypes.NUMBER,
        DEPARTMENT_CODE: DataTypes.STRING(10),
        LOT: DataTypes.STRING,
        CYCLE_TIME: DataTypes.NUMBER,
        UOM: DataTypes.STRING,
        RESOURCE_CODE: DataTypes.STRING,
        MACHINE_NAME: DataTypes.STRING,
        BOM_TYPE: DataTypes.STRING,
        ROUTING_TYPE: DataTypes.STRING,
        LEAD_TIME: DataTypes.NUMBER,
        NO_OF_TOOLS: DataTypes.NUMBER,
        GROUP_ID: DataTypes.STRING,
        NO_OF_OPERATORS: DataTypes.NUMBER,
    }, {
    sequelize: pool,
    tableName: 'JAN_RESOURCE_SCHEDULE_GUIDE',
    timestamps: false,
})


ResourceScheduleGuideVModel.hasMany(MachineMasterModel, {
    as: 'machines',
    foreignKey: 'GENERIC_MACHINE',
    sourceKey: 'RESOURCE_CODE',
    foreignKeyConstraint: false,
    constraints: false,
})

MachineMasterModel.belongsTo(ResourceScheduleGuideVModel, {
    as: 'process',
    foreignKey: 'GENERIC_MACHINE',
    targetKey: 'RESOURCE_CODE',
    foreignKeyConstraint: false,
    constraints: false,
})