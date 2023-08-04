import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Gift = sequelize.define("Gift", {
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});
