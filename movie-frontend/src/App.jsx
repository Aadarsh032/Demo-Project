import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Movie from './page/Movie'
import LoginSignup from './page/LoginSignup'
import { ThemeProvider } from '@sparrowengg/twigs-react'
import { Routes, Route } from 'react-router-dom'



function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LoginSignup />}/>
        <Route path="/movies" element={<Movie />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
