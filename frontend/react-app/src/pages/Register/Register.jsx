// src/components/Register/Register.jsx
import React from 'react';
import RegisterForm from '../../components/Register/RegisterForm/RegisterForm';
import RegisterRedirect from '../../components/Register/RegisterRedirect/RegisterRedirect';
import './Register.css';

function Register() {
  return (
    <div className="register-container">
      <h1>Financial Tracker App</h1>
      <RegisterForm />
      <RegisterRedirect />
    </div>
  );
}

export default Register;
