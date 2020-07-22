'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersLiked extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.UsersLiked.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false
        }
      }),
      models.UsersLiked.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  UsersLiked.init({
    
  }, {
    sequelize,
    modelName: 'UsersLiked',
  });
  return UsersLiked;
};