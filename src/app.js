require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use('/', routes);
app.use(errorMiddleware);

module.exports = app;
