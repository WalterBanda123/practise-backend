const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const pool = require('../db/connect');
const asyncWrapper = require('../middleware/async');

function pgIdGenerator() {
    let id = (Math.random() * Math.PI).toPrecision(16).toString().replace('.', '');
    id = parseInt(id)
    return id
}

const createUser = asyncWrapper(async (req, res, next) => {
    const { fName, lName, password, email, phone, id } = req.body

    const emailExist = await pool.query(`SELECT * FROM users WHERE users.email = '${email}'`);
    if (emailExist.rows.length > 0) {
        return res.status(StatusCodes.CONFLICT).json({
            message: 'User with this email already exist',
        })
    }
    else {
        const SALT_ROUNDS = 12
        const id = pgIdGenerator()
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
            const result = pool.query(`INSERT INTO users( id , first_name, last_name, email, phone, password) VALUES(${id},'${fName}', '${lName}', '${email}', '${phone}', '${hash}');
            `)
            if (result) {
                res.status(StatusCodes.ACCEPTED).json({
                    message: 'Successfully created a user',
                    result
                })
            }
            if (err) {
                res.status(StatusCodes.FAILED_DEPENDENCY).json({
                    message: 'Failed to hash password',
                    error: err
                })
            }
        })
    }
});

const getAllUser = asyncWrapper(async (req, res, next) => {
    const users = await pool.query(`SELECT * FROM users`);
    if (users) {
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Successfully fetched all users',
            users: users.rows,
            rows: users.rowCount
        })
    }
});

const getUserById = asyncWrapper(async (req, res) => {
    const { id } = req.params
    const user = await pool.query(`SELECT * FROM users WHERE users.id = '${id}';`)
    if (user) {
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Successfully fetched user',
            user: user.rows[0]
        })
    }
});

const userLogIn = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query(`SELECT * FROM users WHERE users.email = '${email}';`)
    if (result.rows.length > 0) {
        const { rows: users } = result;
        bcrypt.compare(password, users[0].password, (err, same) => {
            if (same === true) {
                const TOKEN = jwt.sign({ userId: users[0].id }, process.env.JWT_SECRET_KEY, { expiresIn: '1w' })

                res.status(StatusCodes.ACCEPTED).json({
                    message: 'Successfully signed user',
                    TOKEN
                })
            }
            else {
                res.status(StatusCodes.FORBIDDEN).json({
                    message: 'Auth failed',
                })
            }
        })
    }
    else {
        res.status(StatusCodes.FORBIDDEN).json({
            message: 'Auth failed.'
        })
    }
});

const getUserLoggedIn = asyncWrapper(async (req, res) => {
    const { email } = req.body;
    const userLoggedIn = await pool.query(`SELECT id, first_name,last_name, email, phone FROM users WHERE users.email = '${email}';`)
    
    if (userLoggedIn.rows.length > 0) {
        res.status(StatusCodes.ACCEPTED).json({
            message: 'Successfully fetched user',
            user: userLoggedIn.rows[0]
        })
    }
})

module.exports = {
    createUser,
    getAllUser,
    getUserById,
    userLogIn,
    getUserLoggedIn
}