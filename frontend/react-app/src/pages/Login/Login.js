// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/users/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      // Redireciona para a HomePage após login
      navigate('/home');
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div className="login-container">
      <h1>Financial Tracker App</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Usuário:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <button 
        className="register-button" 
        onClick={() => navigate('/register')}
      >
        Registar
      </button>
    </div>
  );
}

export default Login;
