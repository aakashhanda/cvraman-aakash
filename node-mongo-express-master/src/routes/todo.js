const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator/check');
const TodoController = require('../controllers/TodoController');

router.post(
    '/',
    auth,
    check('title','Please enter the content').not().isEmpty(),
    TodoController.create
);

router.patch(
    '/:id',
    auth,
    TodoController.update
)

router.delete(
    '/:id',
    auth,
    TodoController.delete
 )

module.exports = router;
