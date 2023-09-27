const express = require('express');
const router = express.Router();
const userController = require('./../controllers/users');


router.route('/').post(userController.createUser).get(userController.getAllUser);
router.route('/:id').get(userController.getUserById);
router.route('/login').post(userController.userLogIn);
router.route('/logged').post(userController.getUserLoggedIn)

module.exports = router