import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()

const db_password = process.env.DB_PASSWORD
const db_host = process.env.DB_HOST
const db_user = process.env.DB_USER
const db_db = process.env.DB_DB

// export const sequelize = new Sequelize(
//     db_db, 
//     db_user, 
//     db_password, 
//     {
//         host: db_host,
//         dialect: 'postgres',
//     }
// );

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dbdev.sqlite'
})