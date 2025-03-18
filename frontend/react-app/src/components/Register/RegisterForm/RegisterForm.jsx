// src/components/Register/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username, password };
    console.log("Enviando:", payload);
    const response = await fetch('/api/users/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      await response.json();
      navigate('/');
    } else {
      const errorData = await response.json();
      console.error('Erro ao registrar:', errorData);
      alert('Erro ao registrar');
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Registar</h2>
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
      <button type="submit">Registar</button>
    </form>
  );
}

export default RegisterForm;
