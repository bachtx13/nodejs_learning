"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "provider_id", {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "providers",
        },
        key: "id",
      },
    });
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "provider_id");
    await queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },
};
