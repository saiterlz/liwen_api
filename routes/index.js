const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({message: 'Hello 重新 开始 Node.js'});
});

module.exports = router;
