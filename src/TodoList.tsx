import type { Todo } from "./types"
import { TodoItem } from "./TodoItem"

type TodoListProps = {
  todos: Todo[],
  toggleTodo: (id: string, completed: boolean) => void,
  deleteTodo: (id: string) => void
}

export function TodoList({ todos, toggleTodo, deleteTodo }: TodoListProps) {
  return (
    <ul className="list">
      {todos.length === 0 && "No Todos yet"}
      {todos.map(todo => {
        return <TodoItem {...todo} key={todo.id} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      })}
    </ul>
  )
}