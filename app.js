const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//前台路由文件
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories')
const articlesRouter = require('./routes/articles')

//后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoryiesRouter = require('./routes/admin/categories');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//前台路由配置
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories',categoriesRouter);
app.use('/articles',articlesRouter);

//后台路由配置
app.use('/admin/articles',adminArticlesRouter);
app.use('/admin/categories',adminCategoryiesRouter);

module.exports = app;
