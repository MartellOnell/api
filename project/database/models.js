import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permissions: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nomenclature: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vendorCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    coast: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subcategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    }
})
