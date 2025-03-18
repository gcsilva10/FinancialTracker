// src/components/TransactionDetail/TransactionInfo.jsx
import React from 'react';
import './TransactionInfo.css';

function TransactionInfo({ transaction }) {
  const formattedDate = new Date(transaction.date).toLocaleDateString('pt-PT');

  return (
    <div className="transaction-info">
      <p><strong>Data:</strong> {formattedDate}</p>
      <p><strong>Tipo:</strong> {transaction.type}</p>
      <p><strong>Categoria:</strong> {transaction.category}</p>
      <p><strong>Descrição:</strong> {transaction.description || '-'}</p>
      <p><strong>Valor:</strong> {parseFloat(transaction.amount).toFixed(2)}</p>
    </div>
  );
}

export default TransactionInfo;
