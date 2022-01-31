import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Orders from "./pages/orders";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/profile';
import Items from './pages/items';
let cookies = {};
function getCookie(string) {
  string = string.split(';');
  for (let i = 0; i < string.length; i++) {
    let [key, value] = string[i].split('=');
    key = key.trim();
    value = value.trim();
    cookies[key] = value;
  }
  return cookies;
}
const cookie = document.cookie ? getCookie(document.cookie) : {};
function App() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/login' || path === '/signup') {
      if (cookie['user_id']) { // User is already logged in
        window.location.pathname = '/';
      }
    } else if (!cookie['user_id'] && path !== '/') {
      window.location.pathname = '/login';
    }
  }, [window.location.pathname]);

  return (
    <>
      <Navbar/>
      <Router>
        <Routes>
          <Route path="*" element={<div className='not_found' style={{height:'100vh', maxHeight: '500px'}}>Error 404: Page Not Found</div>} />
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/orders' element={<Orders user_id={cookie['user_id']}/>} />
          <Route path='/items' element={<Items user_id={cookie['user_id']}/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<Profile user_id={cookies['user_id']} userparams={cookies}/>} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
