const express = require("express")
const router = express.Router();

const {Article ,Category} = require('../../models')
const {Op} = require('sequelize')

/**
 * 查询文章列表
 * GET /admin/articles
 * 异步请示要在函数体前加 async 变量前加 await
 **/


router.get('/', async function (req, res) {
    try {

        const query = req.query;
        //当前是第几页，如果不传，那就是第一页
        const currentPage = Math.abs(Number(query.currentPage)) || 1;

        //每页显示多少条数据，如果不传，那就显示10条
        const pageSize = Math.abs(Number(query.pageSize)) || 10;

        //计算 offset
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            attributes: { exclude: ['CategoryId'] },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
    
            ],
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
        };

        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
        const {count,rows} = await Article.findAndCountAll(condition);

        res.json({
            status: true,
            message: '返查询文章列表成功',
            data: {
                articles: rows,
                pagination: {
                    total: count,
                    currentPage,
                    pageSize,
                },
            }
        });
        /**/

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '返查询文章列表成功',
            errors: [error.message]
        });
    }

});


router.get('/', async function (req, res) {

    const articles = await Article.findAll();
    /**/
    res.json({
        message: '返查询文章列表成功',
        status: true,
        data: {articles}
    });
});

/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get('/:id', async function (req, res) {
    try {
        // 获取文章 ID
        const {id} = req.params;

        // 查询文章
        const article = await Article.findByPk(id);
        if (article) {

            res.json({
                status: true,
                message: '查询文章成功。',
                data: article
            });
        } else {
            res.status(404).json({
                status: false,
                message: '文章未找到。',
            });
        }

    } catch (e) {
        res.status(500).json({
            status: false,
            message: '查询文章失败。',
            errors: [e.message]
        });
    }

});


/**
 * 创建文章
 * POST /admin/articles
 */

router.post('/', async function (req, res) {
    try {
        const article = await Article.create(req.body);

        res.status(201).json({
            status: true,
            message: '创建文章成功。',
            data: article
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '创建文章失败。',
            errors: [error.message]
        })
    }
});

/**
 * 删除文章
 * DELETE /admin/articles/:id
 */
router.delete('/:id', async function (req, res) {
    try {
        // 获取文章 id
        const {id} = req.params;
        const article = await Article.findByPk(id);

        if (article) {
            await article.destroy();
            res.json({
                status: true,
                message: '删除文章成功。'
            });
        } else {
            res.status(404).json({
                status: false,
                message: '文章未找到。'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '删除文章失败。',
            errors: [error.message]
        })
    }
})

/**
 * 更新文章
 * PUT /admin/articles/:id
 */

router.put('/:id', async function (req, res) {
    try {
        const {id} = req.params;
        const article = await Article.findByPk(id);

        if (article) {
            await article.update(req.body)

            res.json({
                status: true,
                message: '更新文章成功。',
                data: article
            });

        } else {
            res.status(404).json({
                status: false,
                message: '文章未找到。'
            });
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '更新文章失败。',
            errors: [error.message]
        })
    }
})

module.exports = router;

