import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const video = sequelize.define('Video', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  URL: {
    type: DataTypes.STRING,
    allowNull: false
  }
});