const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite file stored in backend/ directory
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'groupgift.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;
