# Initialize a React project

The simplest way to start a new React project is to open up a terminal and run:
```bash
npm create vite@latest
```

This requires to have Node.js and npm installed.  
**Note**: most of the time, npm gets installed by installing Node.js  

The above command will help us initialize a React project with **Vite**.  
Vite is a frontend build tool and development server designed to deliver a better DX for web projects.  

After running this command, you'll get a wizard:
- name your project (just type period `.` if you're already in your project's folder)
- name your package
- choose React
- select TypeScript

Now, we can run `npm i` to install all our project’s dependencies.  
Theses dependencies are specified in our `package.json` file, and will be installed into the local `node_modules` folder.   
They include React, Vite, and any other packages required for our new project to work as intended.  

Finally, run `npm run dev` to start the development server.  
We now have a basic Vite + React application running at http://localhost:5173/

# Initial Structure of a React project

We have an `index.html` file with a single div in it and a script tag that points to a `main.tsx` file: 
```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

And in the `main.tsx` file, we use the div from the `index.html` to create the root of our React application:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
The `<App />` tag above refers to the App component that is implemented inside the `App.tsx` file.   

This `App.tsx` file contains the code that will create a div with a class name of `App` inside the `root` div  
that already exists in the `index.html` file.  

As you can see, the App component is actually a function that returns some TSX code, which is very similar to HTML.  

# Building the layout

Here's how it looks after we've implement the layout in our `App.tsx` file:
```tsx
export default function App() {
  return (
    <>
      <form className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input type="text" id="item" />
        </div>
        <button className="btn">Add</button>
      </form>
      <h1 className="header">TODO List</h1>
      <ul className="list">
        <li>
          <label>
            <input type="checkbox" />
            Item 1
          </label>
          <button className="btn btn-danger">Delete</button>
        </li>
        <li>
          <label>
            <input type="checkbox" />
            Item 2
          </label>
          <button className="btn btn-danger">Delete</button>
        </li>
      </ul>
    </>
  )
}
```

## Each component can only return a single element

To get around this, we could just wrap multiple elements inside of a `<div>`.  
Or instead, we could use what is called a **fragment**.  

### What is a fragment?

A fragment is just an element that has no tag at all inside of it, here's how it looks:
```tsx
export default function App() {
  return (
    <>
      <form className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input type="text" id="item" />
        </div>
        <button className="btn">Add</button>
      </form>
      <h1 className="header">TODO List</h1>
    </>
  )
}
```

So if we want to return multiple elements from a single component, we need to use a **fragment**.  

# Make things interactive

To achieve interactivity in React, we need to use something called "**State Hook**".  
To make our App component interactive, we'll add a hook inside of it:
```tsx
import { useState } from 'react'

export default function App() {
  const [newItem, setNewItem] = useState("")

  return(
    ...
  )
}
```

There are many hooks in React, useState is one of them.  
`useState` is a function provided by React that lets us add a "**state variable**" to our component.  

Think of "state" as any data that can change over time and should cause the component to re-render when it does.  

In the snippet above, we're passing an empty string to `useState` as the initial value for our state.  
So, when the App component first loads, the input field will be empty.    

Our useState function returns an array containing 2 things:
- `newItem`: the current value of our state
- `setNewItem`: a special function that updates the state

We never modify the state variable directly. Instead we call this special function with the new value,  
and React will take care of re-rendering our component with the updated state.  

`const [...] = ...` is modern JS syntax called "**Array destructuring**".

## Updating the user input when it changes

```tsx
export default function App() {
  const [newItem, setNewItem] = useState("")

  return (
    <>
      <form className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="item" />
        </div>
        <button className="btn">Add</button>
      </form>
```

- We set the input value to `{newItem}` to display whatever the user types inside the input field  
- we use the `onChange` event handler to update the state every time a change occurs in the input field
- `e.target` refers to the DOM element that triggers the event, which is the `<input>` element
- `e.target.value` is the current text inside the input field

## Adding an item to the list

- we add the `onSubmit` attribute to the form and set it to `{submitHandler}`
```tsx
<form onSubmit={handleSubmit} className="new-item-form">
```
- we implement the `submitHandler` function right above the return statement
```tsx
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
```

- we define a custom type, then we add another state variable (todos) and a function to update it (setTodos)
```tsx
type Todo = {
  id: string,
  title: string,
  completed: boolean
}

export default function App() {
  const [newItem, setNewItem] = useState("")
  const [todos, setTodos] = useState<Todo[]>([])  
```

## Rendering the todos items dynamically

For now, our list is still displaying hardcoded items.  
Instead, we want to render them from our `todos` state dynamically.  

To do that, we need to use a `map()` function inside of our `<ul>` element:
```tsx
<ul className="list">
  {todos.map(todo => {
    return (
      <li key={todo.id}>
        <label>
          <input type="checkbox" checked={todo.completed} />
          {todo.title}
        </label>
        <button className="btn btn-danger">Delete</button>
      </li>
    )
  })}
</ul>
```

## Handling the checkbox state

When clicking on the checkbox next to a list item, we want our app to check the box.  
To do that, we first add an event handler like this:
```tsx
<input type="checkbox" checked={todo.completed} onChange={e => toggleTodo(todo.id, e.target.checked)} />
```
- The `onChange` attribute runs the `toggleTodo` function when the checkbox state changes
- This function needs `todo.id` to know which checkbox should be toggled or untoggled
- And it also needs `e.target.checked` to determine if the checkbox is currently checked or not

Here's how our `toggleTodo` function looks like:
```tsx
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
```

## Deleting the items

This time, we'll use the `onClick` attribute on the Delete button:
```tsx
<button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
```

And here's how our `deleteTodo` function looks like:
```tsx
function deleteTodo(id: string) {
  setTodos(currentTodos => {
    return currentTodos.filter(todo => todo.id !== id)
  })
}
```
This renders all the todos except for the one that matches the provided id.  

### Important note

We want to **reference** the `deleteTodo` function, but since we need to pass it the `todo.id` argument,  
we need to use an anonymous function.  

We want the `deleteTodo` function to only be called when the button is clicked.  
Without the anonymous function, it would be called immediately, each time the page is loaded.  

Every time a function is followed by parameters (parentheses), it will be called immediately.  
To reference a function (so it doesn't get called immediately), we need to either: 
- omit the parentheses when we don't need to pass any parameters 
- or use an anonymous function when we have to use parameters

## What if we have no todos in our list?

### A word about short circuiting

**Short circuiting** in React refers to using JavaScript's logical operators (&& and ||) for concise conditional rendering of UI elements. This approach leverages the fact that in JavaScript, logical expressions evaluate from left to right and return as soon 
as the outcome is determined, thus "short-circuiting" the remaining expressions.  

In our case, we can use the following to display a specific message when there's no todos:
```tsx
<ul className="list">
  {todos.length === 0 && "No Todos yet"} {/* message displayed when there are no todos */}
  {todos.map(todo => {                   {/* message not displayed when there are todos */}
    return (
      ...
    )
  })}
```

# There's room for improvement

Let's break our code into different components (files):
- one component for the form = `NewTodoForm.tsx`
- another component for the list = `TodoList.tsx`
- and a last one for the individual items = `TodoItem.tsx`

Then, we can import these components into our `App.tsx` file:
```tsx
import NewTodoForm from "./components/NewTodoForm"
import TodoList from "./components/TodoList"
```

And add them to the `return` statement of our App component:
```tsx
export default function App() {
  return (
    <>
      <NewTodoForm />
      <TodoList />
    </>
  )
}
```

But it's actually a bit more complicated than that. Let's see how this is done...

## NewTodoForm component

Notice that, in `NewTodoForm.tsx`, we have removed the following code from our `handleSubmit` function:
```tsx
setTodos(currentTodos => {
  return [
    // the spread syntax creates a copy of the array, sbecause React = immutability
    ...currentTodos,  
    // then we create a new TODO object
    {
      id: crypto.randomUUID(),  // unique identifier for the new todo item
      title: newItem,  // sets the title of the todo item to the value being held by the newItem state variable
      completed: false  // When a new todo is created, it's not completed yet (the checkbox is unchecked)
    }
  ]  
})
```

This `setTodos` needs to live inside of our `App` because this is where our todos state lives:  
`const [todos, setTodos] = useState<Todo[]>([])`  

And we can't move our todos state into `NewTodoForm` because it's also needed for our todo `<ul>` list.  

The solution is to create a simple function `addTodo()` in the App component, and then paste the above `setTodos` code.  
```tsx
function addTodo(title: string) {
  setTodos(currentTodos => {
    return [
      ...currentTodos,  
      {
        id: crypto.randomUUID(),  
        title,  
        completed: false  
      }
    ]  
  }) 
}
```

Now we need to pass that function down to our `NewTodoForm`:
```tsx
export function NewTodoForm() {
  const [newItem, setNewItem] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // prevents the page from refreshing, which would reset our app's state
    if (newItem === "") return  // so we cannot add an empty item
    addTodo(newItem)
    setNewItem("") // clears the input field after a new item is added
  }
```
Notice the `newItem` is now passed into the `addTodo()` function instead of the `setTodos()`.  

But how can we use `addTodo` inside `NewTodoForm.tsx` since it's declared in `App.tsx`?  
This is where the concept of **props** comes in...

### Props (very important)

Props allow us to pass information down to child components.  
The same way we add attributes to HTML elements, we can add attributes to React components.  

In our App component, we can add the addTodo function as a prop to the NewTodoForm component:
```tsx
<NewTodoForm addTodo={addTodo} />
```

In our case, `App.tsx` is the parent component.  
And we need it to pass `addTodo` down to `NewTodoForm.tsx`.  

Then, in the NewTodoForm component, we need to use this prop:
```tsx
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
```
Since we're using TypeScript, we first need to type the props. 

## TodoList component

The same way we have pasted our form inside the NewTodoForm component, we create a new component = `TodoList.tsx`  
And inside of it we create a function `TodoList()` in which we put the `<ul>...</ul>` code from `App.tsx`  

And instead of the `<ul>` element inside of App.tsx, we add the `<TodoList />` component.  

Now, we need to pass all the props that this component needs:
- in the TodoList component:
```tsx
type TodoListProps = {
  todos: Todo[],
  toggleTodo: (id: string, completed: boolean) => void,
  deleteTodo: (id: string) => void
}

export function TodoList({ todos, toggleTodo, deleteTodo }: TodoListProps) {
  ...
}
```
- in the App component:
```tsx
<TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
```

## TodoItem component

Instead of returning an `<li>` element, the TodoList will return a `<TodoItem />` component.  
This component takes all of the props of our todo: `<TodoItem id={todo.id} title={todo.title} completed={todo.completed} />`  

We actually have to move the `key` prop from our `<li>` element to the `TodoItem` component:  
- check line 223 of this file to know which prop I'm talking about.
```tsx
<TodoItem id={todo.id} title={todo.title} completed={todo.completed} key={todo.id} />
```

In fact, we can replace our component's props `id={todo.id} title={todo.title} completed={todo.completed}` with `{...todo}`   
That is called the **"spread syntax for props"**, and it's a powerful and widely-used feature in React.  

### id prop vs key prop

The `id` prop is for our component's logic, while the `key` prop is a special instruction for React itself.  

When rendering a list of elements from an array (like our `todos.map()`), React needs a way to uniquely identify  
each item in that list. This is crucial for performance.  

Without the `key` prop, React might have to re-render the entire list, which is inefficient.  

With the `key` prop, React can quickly identify which items are new, which were removed, and which just moved.  
It can then update the DOM precisely and efficiently, only changing what's necessary.  

This `key` prop is used internally by React and is not passed down to our component.  
We cannot access `props.key` inside the `TodoItem` component.  

The `id` prop, on the other hand, is a regular prop that we have defined ourselves.  
We pass it to our `TodoItem` component just like `title` and `completed`.  
Our component receives this prop and can use it in its own logic: when calling `deleteTodo()` or `toggleTodo()`.

In short: 
- the `key` prop is to uniquely identify elements in a list for efficcient DOM updates (used by React)
- the `id` prop is to pass the todo's unique identifier for the component's own logic

# Make the data persist inside the local storage 

We've seen how to use `useState`.
To persist data inside the local storage, we need to use another React hook called `useEffect`.  

`useState` returns 2 things: a stateful value, and a function to udpate it.  

`useEffect` doesn't return anything, but it takes a function as its argument.  
This function takes 2 parameters: 
- what should be done (saving our todos to local storage)
- the array that it needs to watch for any change (`[todos]`)

Here's the corresponding code (inside of App.tsx):
```tsx
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]) 
  
  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])
```

Every single time that a change occurs inside of the todos array, we want to run the code inside of useEffect.  
This code will take our todos and store them inside the local storage.  

# Retrieving information from local storage

To get our information from local storage, we're going to call the existing useState, but instead of passing  
it a default value, we're going to pass it a function.  
```tsx
export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []  // true if localValue is either null or undefined
    return JSON.parse(localValue)  // else return the previously saved todos 
  }) 
```

The function version of useState works exactly the same: whatever this function returns will be the default value.  

Now, when we reload the page, we don't lose our todos.  
And this is thanks to the combination of useEffect and useState.  

# About local storage

Data stored in localStorage does not have a built-in expiration date and persists even after the browser is closed 
or the computer is restarted. You only lose this data if:
- You (or your code) specifically delete it.
- The user clears their browser data/cache, including "cookies and other site data."
- The browser runs out of space and evicts old data.
- In private/incognito mode, data may be cleared when all private windows are closed

# Important note about Hooks

React hooks need to be called **at the top** of our function (functional component).  
```tsx
export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []  // true if localValue is either null or undefined
    return JSON.parse(localValue)  // else return the previously saved todos 
  }) 
  
  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])
```

We cannot include a hook in a conditional statement, nor inside a loop.  
We cannot put hooks after returns.

# React components structure

React components almost always follow a similar structure:
- we have some hooks at the very top
- then some helper functions, or maybe some code that's doing some parsing of data
- and finally we have your return statement which has all of our .jsx/.tsx code

Check the `App.tsx` file and you'll notice such structure.
