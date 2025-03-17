import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'

const root = document.getElementById('root')
const reactRoot = ReactDOM.createRoot(root)

reactRoot.render(
  <BrowserRouter><App /></BrowserRouter>
)
