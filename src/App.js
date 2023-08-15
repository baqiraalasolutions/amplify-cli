import React, { useState, useEffect } from 'react';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { API } from '@aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';

Amplify.configure(awsConfig);

function App() {
  const [todoName, setTodoName]               = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [todos, setTodos]                     = useState([]);

  const handleCreateTodo = async () => {
    try {
      const todoDetails = {
        name: todoName,
        description: todoDescription
      };

      const result = await API.graphql({
        query: createTodo,
        variables: { input: todoDetails }
      });
      fetchTodos();
      // Clear input fields
      setTodoName('');
      setTodoDescription('');
      console.log('Todo created:', result.data.createTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const result = await API.graphql({ query: listTodos });
      const todos  = result.data.listTodos.items;
      setTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Create a New Todo</h1>
      <input
        type="text"
        placeholder="Todo name"
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Todo description"
        value={todoDescription}
        onChange={(e) => setTodoDescription(e.target.value)}
      />
      <button onClick={handleCreateTodo}>Create Todo</button>
      
      <h1>List of Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.name}</strong>
            <p>{todo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
