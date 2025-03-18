// src/components/Login/Login.jsx
import React, { useEffect } from 'react';
import LoginForm from '../../components/Login/LoginForm/LoginForm';
import RegisterButton from '../../components/Login/RegisterButton/RegisterButton';
import './Login.css';

function Login() {
  useEffect(() => {
    // Guarda o overflow original do body
    const originalOverflow = document.body.style.overflow;
    // Desabilita o scroll
    document.body.style.overflow = 'hidden';

    // Restaura o overflow quando o componente for desmontado
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="login-container">
      <h1>Financial Tracker App</h1>
      <LoginForm />
      <RegisterButton />
    </div>
  );
}

export default Login;
