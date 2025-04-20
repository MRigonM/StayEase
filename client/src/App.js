import './App.css';
import './index.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


const Home = lazy(() => import('./pages/mainPages/Home'))
const LogIn = lazy(() => import('./pages/LogIn/LogIn'))
const Register = lazy(() => import('./pages/Register/Register'))

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense>
          <Routes>

            <Route exact path="/" element={<Home />} />
            <Route exact path="/logIn" element={<LogIn />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>

      </Router>
    </div>
  );
}

export default App;
