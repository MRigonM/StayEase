import './App.css';
import Navbar from './components/Navbar';
import './index.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


const Home = lazy(() => import('./pages/mainPages/Home'))
const LogIn = lazy(() => import('./pages/LogIn/LogIn'))
const Register = lazy(() => import('./pages/Register/Register'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail/PropertyDetail'))
const SearchResult = lazy(() => import('./pages/SearchResult/SearchResult'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'))
const HostYourHomePage = lazy(() => import('./pages/HostAHousePage/HostAHousePage'))

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/logIn" element={<LogIn />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/propertyDetail" element={<PropertyDetail />} />
            <Route exact path="/searchResult" element={<SearchResult />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/profilePage" element={<ProfilePage />} />
            <Route exact path="/hostYourHome" element={<HostYourHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>

      </Router>
    </div>
  );
}

export default App;
