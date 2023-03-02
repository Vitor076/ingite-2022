const express = require('express');
const {v4: uuidv4} = require("uuid")
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers
  const user = users.find(user => user.username === username)

  if(!user){
    return response.status(400).json({erro: "username not found"})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  
  const {name,username} = request.body
  const userAlreadyExists = users.some((users) => users.username === username)
  
  if(userAlreadyExists){
    return response.status(400).json({error:"Username in user!"})
  }

  users.push({
	id: uuidv4(),
	name, 
	username, 
	todos: []})

  return response.status(201).send()

})

app.get('/todos', checksExistsUserAccount, (request, response) => {
    const {user} = request
    return response.json(user.todos)
})

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request
  const {title,deadline} = request.body

	user.todos.push({
  id: uuidv4(),
	title,
	done: false, 
	deadline: new Date(deadline),
	created_at: new Date()

  
 })

 return response.status(201).send(user.todos)

 })

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request
  const {title,deadline} = request.body
  const {id} = request.params

    const todo = user.todos.find(todo => todo.id === id)
    if(!todo){
      return response.status(404).json({error: 'Todo not found'})
    }

  todo.title = title
  todo.deadline =  new Date(deadline)

  return response.json(todos)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request
  const {id} = request.params

  const todo = user.todos.find(todo => todo.id === id)
  
  if(!todo){
    return response.status(404).json({error: 'Todo not found'})
  }

  todo.done = true

  return response.json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request
  const {id} = request.params

  const todo_index = user.todos.findOne(todo => todo.id === id)

  if(todo_index === -1){
    return response.status(404).json({error: 'Todo not found'})
  }


  user.todos.splice(todo,1)

  return response.status(204).json(todo)

});

module.exports = app;