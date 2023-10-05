import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';


export class QtyRawLogsModel extends Model<InferAttributes<QtyRawLogsModel>, InferCreationAttributes<QtyRawLogsModel>>{
    declare id: CreationOptional<number>;
    declare query: CreationOptional<string>;
    declare reply: CreationOptional<string>;
    declare MACHINE_CODE: CreationOptional<string>;
    declare DEPARTMENT_CODE: CreationOptional<string>;
    declare REQ_ID: CreationOptional<number>;
    declare ITEM_NO: CreationOptional<string>;
    declare ITEM_DESC: CreationOptional<string>;
    declare createdAt?: CreationOptional<Date>
}

QtyRawLogsModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        MACHINE_CODE: {
            type: DataTypes.STRING
        },
        DEPARTMENT_CODE: {
            type: DataTypes.STRING
        },
        ITEM_NO: {
            type: DataTypes.STRING
        },
        ITEM_DESC: {
            type: DataTypes.STRING
        },
        REQ_ID: {
            type: DataTypes.NUMBER
        },
        query: {
            type: DataTypes.BLOB
        },
        reply: {
            type: DataTypes.STRING
        }
    }, {
    sequelize: pool,
    tableName: 'JAN_QTY_RAW_LOG',
    freezeTableName: true,
    timestamps: true
});