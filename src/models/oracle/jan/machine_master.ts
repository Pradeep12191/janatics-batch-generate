import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { pool } from '../../../util/database';


export class MachineMasterModel extends Model<InferAttributes<MachineMasterModel>, InferCreationAttributes<MachineMasterModel>>{
    declare DEPARTMENT: CreationOptional<string>;
    declare GENERIC_MACHINE: CreationOptional<string>;
    declare MACHINE_CODE: CreationOptional<string>;
    declare MACHINE_DESCRIPTION: CreationOptional<string>;
    declare RESOURCE_CATEGORY: CreationOptional<string>;
    declare RM: CreationOptional<string>;
    declare GROUP_CODE: CreationOptional<string>;
    declare group?: string | null;

}

MachineMasterModel.init(
    {
        DEPARTMENT: DataTypes.STRING,
        GENERIC_MACHINE: DataTypes.STRING,
        MACHINE_CODE: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        MACHINE_DESCRIPTION: DataTypes.STRING,
        RESOURCE_CATEGORY: DataTypes.STRING,
        RM: DataTypes.STRING,
        GROUP_CODE: DataTypes.STRING
    }, {
    sequelize: pool,
    tableName: 'JAN_SF_MACHINE_MASTER_T',
    freezeTableName: true,
    timestamps: false
})
