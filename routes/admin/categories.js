const express = require("express")
const router = express.Router();
const {Category} = require('../../models')
const {Op} = require('sequelize')

/**
 * 查询分类列表
 * GET /admin/categories
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
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
        };

        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }
        const {count,rows} = await Category.findAndCountAll(condition);

        res.json({
            status: true,
            message: '返查询分类列表成功',
            data: {
                categories: rows,
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
            message: '返查询分类列表失败',
            errors: [error.message]
        });
    }

});


router.get('/', async function (req, res) {

    const categories = await Category.findAll();
    /**/
    res.json({
        message: '返查询分类列表成功',
        status: true,
        data: {categories}
    });
});

/**
 * 查询分类详情
 * GET /admin/categories/:id
 */
router.get('/:id', async function (req, res) {
    try {
        // 获取分类ID
        const {id} = req.params;

        // 查询分类
        const category = await Category.findByPk(id);
        if (category) {

            res.json({
                status: true,
                message: '查询分类成功。',
                data: category
            });
        } else {
            res.status(404).json({
                status: false,
                message: '分类未找到。',
            });
        }

    } catch (e) {
        res.status(500).json({
            status: false,
            message: '查询分类失败。',
            errors: [e.message]
        });
    }

});


/**
 * 创建分类
 * POST /admin/categories
 */

router.post('/', async function (req, res) {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            status: true,
            message: '创建分类成功。',
            data: category
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '创建分类失败。',
            errors: [error.message]
        })
    }
});

/**
 * 删除分类
 * DELETE /admin/categories/:id
 */
router.delete('/:id', async function (req, res) {
    try {
        // 获取分类id
        const {id} = req.params;
        const category = await Category.findByPk(id);

        if (category) {
            await category.destroy();
            res.json({
                status: true,
                message: '删除分类成功。'
            });
        } else {
            res.status(404).json({
                status: false,
                message: '分类未找到。'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '删除分类失败。',
            errors: [error.message]
        })
    }
})

/**
 * 更新分类
 * PUT /admin/categories/:id
 */

router.put('/:id', async function (req, res) {
    try {
        const {id} = req.params;
        const category = await Category.findByPk(id);

        if (category) {
            await category.update(req.body)

            res.json({
                status: true,
                message: '更新分类成功。',
                data: category
            });

        } else {
            res.status(404).json({
                status: false,
                message: '分类未找到。'
            });
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '更新分类失败。',
            errors: [error.message]
        })
    }
})

module.exports = router;

