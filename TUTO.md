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

## Deleting the items




@26/42