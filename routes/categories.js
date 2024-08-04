const express = require('express');
const router = express.Router();
const { Category } = require('../models');

/**
 * 查询分类列表
 * GET /categories
 */
router.get('/', async function (req, res) {
  try {
    const categories = await Category.findAll({
      order: [['rank', 'ASC'], ['id', 'DESC']]
    });
    res.json({
        message: '返查询文章列表成功',
        status: true,
        data: {categories}
    });
  } catch (error) {
    res.status(500).json({
        status: false,
        message: '返查询分类列表失败',
        errors: [error.message]
    });
  }
});

module.exports = router;