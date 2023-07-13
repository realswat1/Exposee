import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Video = sequelize.define('Video', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});