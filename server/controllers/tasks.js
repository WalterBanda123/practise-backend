const asyncWrapper = require('../middleware/async');
const pgIdGenerator = require('../utilities/idGenerator');
const pool = require('./../db/connect');
const { StatusCodes } = require('http-status-codes');



const getAllTasks = asyncWrapper(async (req, res, next) => {
    const tasks = await pool.query(`SELECT *  FROM tasks;`);
    if (tasks) {
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Successfully fetched all tasks',
            tasks: tasks.rows,
            tasksCount: tasks.rowCount
        })
    }
    else {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Failed to fetch tasks',
        })
    }
});

const getTasksByUser = asyncWrapper(async (req, res) => {
    const { id: userId } = req.params;
    const userTasks = await pool.query(`SELECT * FROM tasks WHERE tasks.owner = '${userId}';`)
    if (userTasks) {
        const { rowCount, rows } = userTasks;
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Successfully fetched tasks for user',
            tasks: rows,
            count: rowCount
        })
    }
    else {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Failed to fetch tasks for this user'
        })
    }
})
const getTaskById = asyncWrapper(async (req, res) => {
    const { id: taskId } = req.params;
    const selectedTask = await pool.query(`SELECT * FROM tasks WHERE tasks.id = '${taskId}';`)
    if (selectedTask) {
        const { rows } = selectedTask;
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Successfully fetched selected task',
            task: rows[0],
        })
    }
    else {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Failed to fetch selected tasks'
        })
    }
})

const createTask = asyncWrapper(async (req, res) => {
    const { id: userId } = req.params;
    const { title, description, completed } = req.body;
    const taskId = pgIdGenerator();

    console.log('body', req.body);

    const results = await pool.query(`INSERT INTO tasks(id, title, description, createdOn, completed,owner)VALUES('${taskId}', '${title}', '${description}', '${new Date().toDateString()}' ,'${completed}', '${userId}');`);
    if (results) {
        console.log(results);
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Successfully created a tasks',
            results
        })
    }
})

module.exports = {
    getAllTasks,
    getTasksByUser,
    getTaskById,
    createTask
}