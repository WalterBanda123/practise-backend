const express = require('express');
const router = express.Router();
const tasksController = require('./../controllers/tasks')


router.route('/').get(tasksController.getAllTasks)
router.route('/:id').get(tasksController.getTaskById).post(tasksController.createTask)
router.route('/user/:id').get(tasksController.getTasksByUser);

module.exports = router;