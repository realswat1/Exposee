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
    type: DataTypes.INTEGER,
    allowNull:false

  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_live: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  is_saved:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  api_key:{
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
},{
  timestamps: true,
  created_at: 'created_at',
  updated_at: 'updated_at'
}
);

