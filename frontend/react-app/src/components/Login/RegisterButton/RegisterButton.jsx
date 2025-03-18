// src/components/Login/RegisterButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterButton.css';

function RegisterButton() {
  const navigate = useNavigate();
  return (
    <button 
      className="register-button" 
      onClick={() => navigate('/register')}
    >
      Registar
    </button>
  );
}

export default RegisterButton;
