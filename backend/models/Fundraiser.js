const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fundraiser = sequelize.define('Fundraiser', {
  fundraiserId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  giftName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 1 },
  },
  occasion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Birthday', 'Farewell', 'Wedding', 'Anniversary', 'Graduation', 'Baby Shower', 'Retirement', 'Other']]
    }
  },
  deadline: {
    type: DataTypes.DATEONLY,  // YYYY-MM-DD
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  organizerName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  organizerEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open',
  }
}, {
  tableName: 'fundraisers',
  timestamps: true,
});

module.exports = Fundraiser;
