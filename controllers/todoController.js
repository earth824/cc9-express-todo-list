const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const readTodo = async () => {
  const data = await fs.readFile('dbs/todolist.json', 'utf8');
  return JSON.parse(data);
};

const saveTodo = data => fs.writeFile('dbs/todolist.json', JSON.stringify(data));

const validateTodo = ({ list, completed, dueDate }) => {
  if (list === undefined) {
    return 'list is required';
  }
  if (typeof list !== 'string') {
    return 'list must be a string';
  }
  if (!list.trim()) {
    return 'list is required';
  }

  // if (list === undefined) return 'list is required';
  // if (typeof list !== 'string') return 'list must be a string';
  // if (!list.trim()) return 'list is required';

  if (typeof completed !== 'undefined' && typeof completed !== 'boolean') {
    return 'completed must be a boolean';
  }

  if (typeof dueDate !== 'undefined' && typeof dueDate !== 'string') {
    return 'dueDate must be a string';
  }
  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    return 'invalid format date string';
  }

  return '';
};

exports.checkExistTodoId = async (req, res, next) => {
  const { id } = req.params;
  const todos = await readTodo();
  const idx = todos.findIndex(item => item.id === id);
  if (idx === -1) {
    return res.status(400).json({ message: 'invalid todo id' });
  }

  req.todos = todos;
  req.idx = idx;
  next();
};

exports.validateTodo = (req, res, next) => {
  const validateError = validateTodo(req.body);

  if (validateError) {
    return res.status(400).json({ message: validateError });
  }
  next();
};

exports.getAllTodo = async (req, res, next) => {
  try {
    const { list, completed } = req.query;
    const todos = await readTodo();
    const filteredTodos = todos.filter(
      item =>
        (list === undefined || item.list.toLowerCase().includes(list.toLowerCase())) &&
        (completed === undefined ||
          !['true', 'false'].includes(completed.toLowerCase()) ||
          '' + item.completed === completed)
    );
    res.status(200).json({ todos: filteredTodos });
  } catch (err) {
    next(err);
  }
};

exports.getTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todos = await readTodo();
    const todo = todos.find(item => item.id === id);
    if (!todo) {
      return res.status(200).json({ todo: null });
    }
    res.status(200).json({ todo });
    // res.status(200).json({ todo: todo ?? null });
  } catch (err) {
    next(err);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const { list, completed, dueDate } = req.body;

    const todos = await readTodo();
    const todo = { id: uuidv4(), list, completed: completed ?? false, dueDate: dueDate ? new Date(dueDate) : null };
    todos.push(todo);
    await saveTodo(todos);
    res.status(200).json({ todo });
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { list, completed, dueDate } = req.body;

    const { todos, idx } = req;

    todos[idx] = { id, list, completed: completed ?? false, dueDate: dueDate ? new Date(dueDate) : null };
    await saveTodo(todos);
    res.status(200).json({ todo: todos[idx] });
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { todos, idx } = req;
    todos.splice(idx, 1);
    await saveTodo(todos);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
