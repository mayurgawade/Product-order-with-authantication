const express = require('express')
const userController = require('../controllers/user');
const checkEmail = require('../middleware/check-email');
const checkAuth = require('../middleware/check-auth')
const router = express.Router();
router.post('/signup', checkEmail, userController.user_create_user)
router.post('/login', checkEmail, userController.user_login)
router.delete('/:userId', checkAuth, userController.user_delete_user)
module.exports = router;