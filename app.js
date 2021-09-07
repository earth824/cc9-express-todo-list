const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');

const app = express();

app.use(express.json());

// Routing for getting todo
// GET /
app.get('/', async (req, res) => {
  try {
    const result = await fs.readFile('dbs/todolist.json');
    const arrTodo = JSON.parse(result);
    res.status(200).json({ todos: arrTodo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routing for creating todo
// POST /create
app.post('/create', async (req, res) => {
  try {
    const body = req.body; // { key1: value1, key2: value2 } => { list, completed, dueDate  }
    // validate data
    // if (body.list === undefined) {
    //   res.status(400).json({ message: 'list is required' });
    // } else if (typeof body.list !== 'string') {
    //   res.status(400).json({ message: 'list must be a string' });
    // } else if (body.list.trim() === '') {
    //   res.status(400).json({ message: 'list is required' });
    // }

    if (body.list === undefined || typeof body.list !== 'string' || body.list.trim() === '') {
      res.status(400).json({ message: 'list is required and must be a string' });
    } else if (typeof body.completed !== 'undefined' && typeof body.completed !== 'boolean') {
      res.status(400).json({ message: 'completed must be a boolean' });
    } else {
      const newTodo = {
        id: uuidv4(),
        list: body.list,
        // completed: typeof body.completed === 'boolean' ? body.completed : false,
        completed: body.completed || false,
        dueDate: isNaN(new Date(body.dueDate).getTime()) ? null : body.dueDate
      };

      const result = await fs.readFile('dbs/todolist.json', 'utf8');
      const arrTodo = JSON.parse(result);
      arrTodo.push(newTodo);

      await fs.writeFile('dbs/todolist.json', JSON.stringify(arrTodo));

      res.status(201).json({ todo: newTodo });
      // res.status(201).json({ message: 'create todo successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routing for updating todo
// PUT /edit?id=7568143c-bf12-409a-912a-dec6d7d6c820      body { list, dueDate, completed }
app.put('/edit', async (req, res) => {
  try {
    const query = req.query;
    // const { id } = req.query;
    const body = req.body;
    // const { list, dueDate, completed } = req.body;
    if (body.list === undefined || typeof body.list !== 'string' || body.list.trim() === '') {
      res.status(400).json({ message: 'list is required and must be a string' });
    } else if (typeof body.completed !== 'undefined' && typeof body.completed !== 'boolean') {
      res.status(400).json({ message: 'completed must be a boolean' });
    } else {
      const result = await fs.readFile('dbs/todolist.json', 'utf8');
      const arrTodo = JSON.parse(result);
      const index = arrTodo.findIndex(item => item.id === query.id);
      if (index !== -1) {
        arrTodo[index] = {
          id: query.id,
          list: body.list,
          completed: body.completed || false,
          dueDate: isNaN(new Date(body.dueDate).getTime()) ? null : body.dueDate
        };
        await fs.writeFile('dbs/todolist.json', JSON.stringify(arrTodo));
        res.status(200).json({ message: 'successfully update' });
      } else {
        res.status(400).json({ message: 'todo with this id is not found' });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routing for deleting todo
// DELETE /delete
app.delete('/delete/:id', async (req, res) => {
  try {
    const params = req.params; // { id: '' }
    console.log(params);
    const result = await fs.readFile('dbs/todolist.json', 'utf8');
    const arrTodo = JSON.parse(result);

    const index = arrTodo.findIndex(item => item.id === params.id);
    if (index !== -1) {
      arrTodo.splice(index, 1);
      await fs.writeFile('dbs/todolist.json', JSON.stringify(arrTodo));
      res.status(204).json({ message: 'delete success' });
    } else {
      res.status(400).json({ message: 'todo with this id is not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(8000, () => console.log('server running on port 8000'));
