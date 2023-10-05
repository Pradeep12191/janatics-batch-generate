import { ResourceScheduleGuideV } from '@models';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { ResourceScheduleGuideVModel } from './resource_schedule_guide_v';


export class ScheduleRequirementModel extends Model<InferAttributes<ScheduleRequirementModel>, InferCreationAttributes<ScheduleRequirementModel>>{
    declare REQ_ID: CreationOptional<number>;
    declare REQ_DATE: CreationOptional<string>;
    declare ORGANIZATION_ID: CreationOptional<number>;
    declare INVENTORY_ITEM_ID: CreationOptional<number>;
    declare ITEM_NO: CreationOptional<string>;
    declare REQUIREMENT: CreationOptional<number>;
    declare JOB_RELEASED_QTY: CreationOptional<number>;
    declare CANCELLED_QTY?: CreationOptional<number>;
    declare TARGET_DATE?: CreationOptional<string>;
    declare SOURCE_ID?: CreationOptional<number>;
    declare BOM_TYPE?: CreationOptional<string>;
    declare ROUTING_TYPE?: CreationOptional<string>;
    declare WIP_ENTITY_ID?: CreationOptional<string>;
    declare CLOSED_FLAG?: CreationOptional<string>;
    declare OS_TAG?: CreationOptional<string>;
    declare OPTIMUM_QTY?: CreationOptional<number>;
    declare NEW_ITEM_TYPE?: CreationOptional<string>;
    declare MRP_ID?: CreationOptional<number>;
    declare GROUP_ID?: CreationOptional<string>;
    declare LINE_ID?: CreationOptional<number>;
    declare TARGET_WEEK_NO?: CreationOptional<number>;
    declare lastId?: number;
    declare productDescription?: string;
    declare batchCount?: number;
    declare processes?: ResourceScheduleGuideV[];
}

ScheduleRequirementModel.init(
    {
        REQ_ID: {
            type: DataTypes.NUMBER,
            primaryKey: true
        },
        REQ_DATE: DataTypes.DATE,
        ORGANIZATION_ID: DataTypes.NUMBER,
        INVENTORY_ITEM_ID: DataTypes.NUMBER,
        ITEM_NO: DataTypes.STRING(500),
        REQUIREMENT: DataTypes.NUMBER,
        JOB_RELEASED_QTY: DataTypes.NUMBER,
        CANCELLED_QTY: DataTypes.NUMBER,
        TARGET_DATE: DataTypes.DATE,
        SOURCE_ID: DataTypes.NUMBER,
        BOM_TYPE: DataTypes.STRING(500),
        ROUTING_TYPE: DataTypes.STRING(500),
        WIP_ENTITY_ID: DataTypes.STRING(500),
        CLOSED_FLAG: DataTypes.STRING(500),
        OS_TAG: DataTypes.STRING(500),
        OPTIMUM_QTY: DataTypes.NUMBER,
        NEW_ITEM_TYPE: DataTypes.STRING(500),
        MRP_ID: DataTypes.NUMBER,
        GROUP_ID: DataTypes.STRING(500), // family mould id
        LINE_ID: DataTypes.NUMBER,
        TARGET_WEEK_NO: DataTypes.NUMBER
    }, {
    sequelize: pool,
    tableName: 'JAN_SCHEDULE_REQUIREMENT',
    freezeTableName: true,
    timestamps: false
})

// associations
// has many schedule_guide linked with ITEM_No
ScheduleRequirementModel.hasMany(ResourceScheduleGuideVModel, {
    as: 'processes',
    foreignKey: 'ITEM_NO',
    sourceKey: 'ITEM_NO',
    foreignKeyConstraint: false,
    constraints: false,
})

ResourceScheduleGuideVModel.belongsTo(ScheduleRequirementModel, {
    foreignKey: 'ITEM_NO',
    targetKey: 'ITEM_NO',
    foreignKeyConstraint: false,
    constraints: false,
    as: 'requirement',
})
