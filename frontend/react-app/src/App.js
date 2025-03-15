// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import HomePage from './pages/Home/HomePage';
import TransactionList from './pages/TransactionList/TransactionList';
import TransactionDetail from './pages/TransactionDetail/TransactionDetail';
import CreateTransaction from './pages/CreateTransaction/CreateTransaction';
import Navbar from './components/Navbar/Navbar';

const Layout = () => (
  <div>
    <Navbar />
    <div style={{ padding: '1rem' }}>
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas sem Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas com Navbar */}
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/:id" element={<TransactionDetail />} />
          <Route path="/create-transaction" element={<CreateTransaction />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
