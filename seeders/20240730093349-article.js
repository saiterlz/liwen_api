'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const articles = [];
    const counts = 100;
  
    for (let i = 1; i <= counts; i++) {
      const article = {
        title: `文章的标题 ${i}`,
        content: `文章的内容 ${i}`,
        picname:`phone_img${i}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      articles.push(article);
    }
  
    await queryInterface.bulkInsert('Articles', articles, {});
  },
  

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
