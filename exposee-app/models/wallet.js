import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Wallet = sequelize.define("Wallet", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deductions: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addition: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});
