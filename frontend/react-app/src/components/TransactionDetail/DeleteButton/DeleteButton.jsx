// src/components/TransactionDetail/DeleteButton.jsx
import React from 'react';
import './DeleteButton.css';

function DeleteButton({ onDelete }) {
  return (
    <button className="delete-button" onClick={onDelete}>
      Apagar Transação
    </button>
  );
}

export default DeleteButton;
