const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contribution = sequelize.define('Contribution', {
  fundraiserId: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    defaultValue: 'Anonymous',
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 1 },
  },
  message: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  paymentMethod: {
    type: DataTypes.ENUM('upi', 'card', 'cash'),
    allowNull: false,
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'contributions',
  timestamps: true,
});

module.exports = Contribution;
