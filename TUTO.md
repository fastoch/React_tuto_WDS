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

# How does it work

Check the `App.tsx` file to see a basic example of a TODO list application.  

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




@15/42