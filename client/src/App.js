import './App.css';
import './index.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


const Home = lazy(() => import('./pages/mainPages/Home'))
const LogIn = lazy(() => import('./pages/LogIn/LogIn'))
const Register = lazy(() => import('./pages/Register/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotResetPassword/ForgetPassword'))
const ResetPassword = lazy(() => import('./pages/ForgotResetPassword/ResetPassword'))
const ConfirmEmail = lazy(() => import('./pages/Register/ConfirmEmail'))
const Explore = lazy(() => import('./pages/Explore/Explore'))
const Details = lazy(() => import('./pages/Details/Details'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const Settings = lazy(() => import('./pages/Settings/Settings'))

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense>
          <Routes>

            <Route exact path="/" element={<Home />} />
            <Route exact path="/logIn" element={<LogIn />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/forgotPassword" element={<ForgotPassword />} />
            <Route exact path="/resetPassword" element={<ResetPassword />} />
            <Route exact path="/confirmEmail" element={<ConfirmEmail />} />
            <Route exact path="/explore" element={<Explore />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>

      </Router>
    </div>
  );
}

export default App;
