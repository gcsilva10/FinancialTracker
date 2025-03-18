// src/components/TransactionDetail/BackButton.jsx
import React from 'react';
import './BackButton.css';

function BackButton({ onBack }) {
  return (
    <button className="back-button" onClick={onBack}>
      Voltar
    </button>
  );
}

export default BackButton;
