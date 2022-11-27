import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './style.css'
import LandingPage from './views/landing-page'
import Page from './views/page'

const App = () => {
  return (
    <Router>
      
        <Routes>
        
        <Route index element={<LandingPage/>}/>
        <Route element={<Page/>} exact path="/page" />
        </Routes>
      
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
