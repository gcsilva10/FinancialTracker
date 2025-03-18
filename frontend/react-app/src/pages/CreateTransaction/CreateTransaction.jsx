// src/components/CreateTransaction/CreateTransaction.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../../components/CreateTransaction/TransactionForm/TransactionForm';
import './CreateTransaction.css';

function CreateTransaction() {
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/tracker/api/transactions/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao criar transação.');
      }
    } catch (err) {
      setError('Erro na requisição.');
    }
  };

  return (
    
    <div className="create-transaction-container">
      <h1>Criar Transação</h1>
      {error && <div className="error">{error}</div>}
      <TransactionForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default CreateTransaction;
