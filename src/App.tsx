import "./styles.css"
import { useState } from "react"

// telling TypeScript what kind of items the todos array will hold
type Todo = {
  id: string,
  title: string,
  completed: boolean
}

export default function App() {
  const [newItem, setNewItem] = useState("")
  const [todos, setTodos] = useState<Todo[]>([])  

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // prevents the page from refreshing, which would reset our app's state
    setTodos(currentTodos => {
      return [
        // the spread syntax creates a copy of the array, so that React can see the change
        ...currentTodos,  
        // then we create the new TODO item
        {
          id: crypto.randomUUID(),  // unique identifier for the new todo item
          title: newItem,  // sets the title of the todo item to the value being held by the newItem state variable
          completed: false  // tracks the status of the todo item. When a new todo is created, it's not completed yet
        }
      ]  
    }) 
    setNewItem("") // clears the input field after a new item is added
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="item" />
        </div>
        <button className="btn">Add</button>
      </form>
      <h1 className="header">TODO List</h1>
      <ul className="list">
        {todos.map(todo => {
          return (
            <li key={todo.id}>  {/* React needs to know which item we're talking about */}
              <label>
                <input type="checkbox" checked={todo.completed} />
                {todo.title}
              </label>
              <button className="btn btn-danger">Delete</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
