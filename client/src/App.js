import './App.css';
import {lazy, Suspense, useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';


const Home = lazy(() => import('./pages/mainPages/Home'))

function App() {
  return (
    <div className="App">
              <Router>
        <Suspense>
          <Routes>

              <Route exact path="/" element={<Home />} />
              <Route path="*" element={<Navigate to ="/" />}/>
          </Routes>
      </Suspense>

        </Router>
    </div>
  );
}

export default App;
