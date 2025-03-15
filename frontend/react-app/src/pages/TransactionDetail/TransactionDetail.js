// src/components/TransactionDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TransactionDetail.css';

function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const response = await fetch(`/tracker/api/transactions/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransaction(data);
        } else {
          console.error('Erro ao buscar transação:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza de que deseja excluir esta transação?")) {
      try {
        const response = await fetch(`/tracker/api/transactions/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          alert("Transação excluída com sucesso.");
          navigate('/transactions');
        } else {
          alert("Erro ao excluir a transação.");
        }
      } catch (error) {
        console.error("Erro ao excluir a transação:", error);
        alert("Erro na requisição de exclusão.");
      }
    }
  };

  if (loading) {
    return <div className="transaction-detail-loading">Carregando detalhes...</div>;
  }

  if (!transaction) {
    return <div className="transaction-detail-loading">Transação não encontrada.</div>;
  }

  const formattedDate = new Date(transaction.date).toLocaleDateString('pt-PT');

  return (
    <div className="transaction-detail-container">
      <h1>Detalhes da Transação</h1>
      <p><strong>Data:</strong> {formattedDate}</p>
      <p><strong>Tipo:</strong> {transaction.type}</p>
      <p><strong>Categoria:</strong> {transaction.category}</p>
      <p><strong>Descrição:</strong> {transaction.description || '-'}</p>
      <p><strong>Valor:</strong> {parseFloat(transaction.amount).toFixed(2)}</p>
      <div className="transaction-detail-buttons">
        <button onClick={() => navigate(-1)} className="back-button">Voltar</button>
        <button onClick={handleDelete} className="delete-button">Apagar Transação</button>
      </div>
    </div>
  );
}

export default TransactionDetail;
