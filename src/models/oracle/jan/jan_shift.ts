import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';


export class JanShiftModel extends Model<InferAttributes<JanShiftModel>, InferCreationAttributes<JanShiftModel>>{
    declare SHIFT_CODE: CreationOptional<string>;
    declare FROM_TIME: CreationOptional<string>;
    declare TO_TIME: CreationOptional<string>;
    declare HRS: CreationOptional<number>;
    declare CALENDAR_ID: CreationOptional<number>
}

JanShiftModel.init(
    {
        SHIFT_CODE: {
            type: DataTypes.STRING(5),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        FROM_TIME: DataTypes.STRING(500),
        TO_TIME: DataTypes.STRING(500),
        HRS: DataTypes.NUMBER,
        CALENDAR_ID: DataTypes.NUMBER
    }, {
        sequelize: pool,
        tableName: 'JAN_SF_SHIFT_CALENDAR',
        freezeTableName: true,
        timestamps: false
})