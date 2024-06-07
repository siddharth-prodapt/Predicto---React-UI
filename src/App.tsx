import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import History from './components/History';
import Login from './components/login';
import Navbar from './components/navbar';
import PrivateRoutes from './components/PrivateRoutes';
import Footer from './components/footer';
import MLActivity from './components/MLActivity';
import SelectModel from './components/SelectModel'
import VisualizeData from './components/VisualizeData';
import MyAccount from './components/MyAccount';
import ListDropDown from './components/ListDropDown';
import { ToastContainer } from 'react-toastify';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 2;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div>
      <ToastContainer
        position="top-right"
        theme="light"
        autoClose={5000}
        closeOnClick
        style={{ width: '30em' }}
      />
      <BrowserRouter>
        <div style={{
          position: 'sticky', top: 0, width: '100%', backgroundColor: 'white',
          transition: 'box-shadow 0.3s ease',
          boxShadow: scrolled ? '0 2px 4px 0 rgba(0, 0, 0, .2)' : 'none',
          zIndex:'10'
        }}
        >
          <Navbar />
        </div>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="/home" replace />} />
            <Route path='home' element={<PrivateRoutes Component={Home} />} />
            <Route path='activity' element={<PrivateRoutes Component={MLActivity} />} />
            <Route path='history' element={<PrivateRoutes Component={History} />} />
            <Route path='selectModel' element={<PrivateRoutes Component={SelectModel} />} />
            <Route path='explore-data' element={<PrivateRoutes Component={VisualizeData} />} />
            <Route path='my-account' element={<PrivateRoutes Component={MyAccount} />} />
            <Route path='listt' element={<PrivateRoutes Component={ListDropDown} />} />
            <Route path='login' element={<Login />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter >
    </div>
  );
}

export default App;
