import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';


export class JanReasonModel extends Model<InferAttributes<JanReasonModel>, InferCreationAttributes<JanReasonModel>>{
    declare LOSS_CODE: CreationOptional<string>;
    declare DESCRIPTION: CreationOptional<string>;
    declare LOSS_CODE_GROUP: CreationOptional<string>;
    declare CATEGORY: CreationOptional<string>; /// breakdown(hold), rejection, shortage
    declare DEPT: CreationOptional<string>;
}

JanReasonModel.init(
    {
        LOSS_CODE: {
            type: DataTypes.STRING(500),
            allowNull: false,
            primaryKey: true
        },
        DESCRIPTION: {
            type: DataTypes.STRING(500)
        },
        LOSS_CODE_GROUP: {
            type: DataTypes.STRING(500)
        },
        CATEGORY: {
            type: DataTypes.STRING(500)
        },
        DEPT: {
            type: DataTypes.STRING(500)
        }
    }, {
    sequelize: pool,
    tableName: 'JAN_LOSS_CODE_MASTER',
    freezeTableName: true,
    timestamps: false
});