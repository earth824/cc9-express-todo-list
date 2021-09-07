const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const todoRouter = require('./routes/todoRoute');

const app = express();

app.use(express.json());

app.use('/todos', todoRouter);

app.listen(8000, () => console.log('server running on port 8000'));
