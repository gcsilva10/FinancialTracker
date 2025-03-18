import React from 'react';
import './DeleteAccountButton.css';

function DeleteAccountButton({ onDelete }) {
  return (
    <div className="delete-account-container">
      <button className="delete-account-button" onClick={onDelete}>
        Apagar Minha Conta
      </button>
    </div>
  );
}

export default DeleteAccountButton;
