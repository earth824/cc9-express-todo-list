const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

router.get('/', todoController.getAllTodo);
// router.get('/query', todoController.getTodoByFilter);
router.get('/:id', todoController.getTodo);
router.post('/', todoController.validateTodo, todoController.createTodo);
router.put('/:id', todoController.validateTodo, todoController.checkExistTodoId, todoController.updateTodo);
router.delete('/:id', todoController.checkExistTodoId, todoController.deleteTodo);

module.exports = router;
