import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/style.scss'
import Home from './pages/Home'
import Width from './components/Width'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './pages/Register'
import Confirm from './pages/Confirm'
import Success from './pages/Success'

function App() {
  return (
    <Width>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/success" element={<Success />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </Width>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
