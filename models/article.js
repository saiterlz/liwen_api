'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Article.belongsTo(models.Category, { as: 'category' });
      
    }
  }
  Article.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    picname: DataTypes.STRING,
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
          notNull: {msg: '文章类别ID必须填写。'},
          notEmpty: {msg: '文章类别ID不能为空。'},
          async isPresent(value) {
              const category = await sequelize.models.Category.findByPk(value)
              if (!category) {
                  throw new Error(`ID为：${value} 的课程不存在。`);
              }
          }
      }
  },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};