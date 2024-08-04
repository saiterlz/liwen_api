const express = require('express');
const router = express.Router();
const { Article,Category } = require('../models');

/**
 * 查询分类列表
 * GET /articles
 */
router.get('/', async function (req, res) {
    try {
        console.log(req.query)
        const query = req.query;
        console.log(query)
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;

        if (!query.categoryId) {
            throw new Error('获取课程列表失败，分类ID不能为空。')
        }
        const condition = {
            attributes: { exclude: ['CategoryId'] },
            where: { categoryId: query.categoryId },
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
        };
        const { count, rows } = await Article.findAndCountAll(condition);
        res.json({
            message: '返回查询分类中的文章列表成功',
            status: true,
            articles: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '返回查询分类中的文章列表失败',
            errors: [error.message]
        });
    }
});


/**
 * 查询分类列表
 * GET /articles/
 */
router.get('/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const condition = {
            attributes: { exclude: ['CategoryId'] },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        };
        const article = await Article.findByPk(id,condition);
        if (!article) {
            throw new HostNotFoundError(`ID:${id}的文章未找到`)
        }
        res.status(200).json({
            status: true,
            message: '查询文章详情成功。',
            data: { article }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '查询文章详情失败。',
            errors: [error.message]
        })
    }
})

module.exports = router;