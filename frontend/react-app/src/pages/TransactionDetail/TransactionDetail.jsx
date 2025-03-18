// src/components/TransactionDetail/TransactionDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TransactionInfo from '../../components/TransactionDetail/TransactionInfo/TransactionInfo';
import BackButton from '../../components/TransactionDetail/BackButton/BackButton';
import DeleteButton from '../../components/TransactionDetail/DeleteButton/DeleteButton';
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

  return (
    <div className="transaction-detail-container">
      <h1>Detalhes da Transação</h1>
      <TransactionInfo transaction={transaction} />
      <div className="transaction-detail-buttons">
        <BackButton onBack={() => navigate(-1)} />
        <DeleteButton onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default TransactionDetail;
