import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import Editor from './views/Editor'
import NotFound from './views/NotFound'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
