import { DATE, DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Video = sequelize.define('Video', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: { 
    type: DataTypes.DATE,
    allowNull:false

  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.TIME,
    allowNull: false 
  },
  is_live: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  is_saved:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  updated_at:{
    type: DataTypes.DATE,
    allowNull: false
  },
  api_key:{
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});