import { Sequelize } from 'sequelize';


console.log('Connecting to Oracle DB', process.env.ORACLE_URL)
console.log('Connecting to Oracle password', process.env.ORACLE_PASSWORD)
console.log('Connecting to Oracle user', process.env.ORACLE_USER)
console.log('Connecting to Oracle database', process.env.ORACLE_DATABASE);


export const pool = new Sequelize(process.env.ORACLE_URL, {
    dialect: 'oracle',
    logging: true,
    dialectOptions: { events: true },
    username: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    pool: {
        max: 400,
        min: 50
    }
})
