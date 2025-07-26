import type { Todo } from "./types"
import { NewTodoForm } from "./NewTodoForm"
import "./styles.css"
import { useState } from "react"
import { useEffect } from "react"
import { TodoList } from "./TodoList"

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []  // true if localValue is either null or undefined
    return JSON.parse(localValue)  // else return the previously saved todos 
  }) 
  
  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])

  function addTodo(title: string) {
    setTodos(currentTodos => {
      return [
        // the spread syntax creates a copy of the array, sbecause React = immutability
        ...currentTodos,  
        // then we create a new TODO object
        {
          id: crypto.randomUUID(),  // unique identifier for the new todo item
          title,  
          completed: false  // When a new todo is created, it's not completed yet (checkbox is unchecked)
        }
      ]  
    }) 
  }

  function toggleTodo(id: string, completed: boolean) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        // if the todo item is the one the user has clicked ...
        if (todo.id === id) {
          // ... return a copy of the todo object on which the 'completed' property has been updated
          return { ...todo, completed } 
        }
        // else return the same todo object (do not change anything)
        return todo
      })
    })
  }

  function deleteTodo(id: string) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  return (
    <>
      <NewTodoForm addTodo={addTodo} />
      <h1 className="header">TODO List</h1>
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </>
  )
}
