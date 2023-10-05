import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';


export class JanEmployeeInfoModel extends Model<InferAttributes<JanEmployeeInfoModel>, InferCreationAttributes<JanEmployeeInfoModel>>{
    declare EMPLOYEE_NO: CreationOptional<string>;
    declare PASSWORD: CreationOptional<number>;
}

JanEmployeeInfoModel.init(
    {
        EMPLOYEE_NO: {
            type: DataTypes.STRING(500),
            allowNull: false,
            primaryKey: true
        },
        PASSWORD: DataTypes.STRING
    }, {
    sequelize: pool,
    tableName: 'JAN_EMPLOYEE_INFO',
    freezeTableName: true,
    timestamps: false
});
