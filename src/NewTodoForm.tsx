import { useState } from "react"

type NewTodoFormProps = {
  addTodo: (title: string) => void
}

export function NewTodoForm({ addTodo }: NewTodoFormProps) {
  const [newItem, setNewItem] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // prevents the page from refreshing, which would reset our app's state
    if (newItem === "") return  // so we cannot add an empty item
    addTodo(newItem)
    setNewItem("") // clears the input field after a new item is added
  }

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <div className="form-row">
        <label htmlFor="item">New Item</label>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="item" />
      </div>
      <button className="btn">Add</button>
    </form>
  )
}