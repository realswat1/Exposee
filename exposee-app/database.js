import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('exposeedb', 'exposeedbuser', 'iamtheSwat1+', {
  host: 'localhost',
  dialect: 'postgres'
})
