import React from 'react';
import './DeleteTransactionsButton.css';

function DeleteTransactionsButton({ onDeleteSelected, selectedIds }) {
  if (selectedIds.length === 0) return null;
  return (
    <button className="delete-selected-button" onClick={onDeleteSelected}>
      Apagar Transações Selecionadas
    </button>
  );
}

export default DeleteTransactionsButton;
