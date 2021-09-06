const express = require('express');
const fs = require('fs/promises');

const app = express();

app.use(express.json());

app.post('/post-submit', async (req, res, next) => {
  const body = req.body;
  const newTodoList = {
    id: uuidv4(),
    list: body.list,
    completed: body.completed,
    dueDate: body.dueDate
  };

  const data = await fs.readFile('dbs/todolist.json', 'utf8');
  const todosArray = JSON.parse(data);
  todosArray.push(newTodoList);
  await fs.writeFile('dbs/todolist.json', JSON.stringify(todosArray));
  res.json({ newTodoList: newTodoList });
});

app.listen(8000, () => console.log('server running on port 8000'));
