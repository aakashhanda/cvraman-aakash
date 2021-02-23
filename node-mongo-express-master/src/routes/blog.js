const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BlogController = require('../controllers/BlogController');

router.get(
    '/',
    BlogController.get
 );

router.post(
    '/',
    auth,
    BlogController.create
 );


module.exports = router;
