"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.STRING,
        field: "hashed_password",
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      phone:{
        type: Sequelize.STRING,
      },
      address:{
        type: Sequelize.STRING,
      },
      car:{
       type: Sequelize.BOOLEAN,
     
      },
      cost:{
        type: Sequelize.DOUBLE,
    
      },
      avalable:{
        type:Sequelize.STRING,
      }, 
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at"
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at"
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};