import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';
import { JanEmployeeInfoModel } from './employee_info';
import { JanEmployeeDepartment } from '@models';


export class JanEmployeeMasterModel extends Model<InferAttributes<JanEmployeeMasterModel>, InferCreationAttributes<JanEmployeeMasterModel>>{
    declare SNO: CreationOptional<number>;
    declare EMPLOYEE_NO: CreationOptional<string>;
    declare EMPLOYEE_NAME: CreationOptional<string>;
    declare CATEGORY: CreationOptional<string>;
    declare departments?: JanEmployeeDepartment[]
}

JanEmployeeMasterModel.init(
    {
        SNO: DataTypes.NUMBER,
        EMPLOYEE_NO: {
            type: DataTypes.STRING(500),
            allowNull: false,
            primaryKey: true
        },
        EMPLOYEE_NAME: DataTypes.STRING(500),
        CATEGORY: DataTypes.STRING(500)
    }, {
    sequelize: pool,
    tableName: 'JAN_SF_EMPLOYEE_MASTER_T',
    freezeTableName: true,
    timestamps: false
});

JanEmployeeMasterModel.hasOne(JanEmployeeInfoModel, {
    as: 'info',
    foreignKeyConstraint: false,
    constraints: false,
    sourceKey: 'EMPLOYEE_NO',
    foreignKey: 'EMPLOYEE_NO'
});
