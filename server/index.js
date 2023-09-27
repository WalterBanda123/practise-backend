const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const notFound = require('./middleware/notFound');
const userRoutes = require('./routes/users')
const tasksRoutes = require('./routes/tasks')
const app = express();

app.use(cors('*'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'))

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/task', tasksRoutes)

const port = process.env.PORT || 3002;

app.use(notFound)
app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
});