// src/components/CreateTransaction.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTransaction.css';

function CreateTransaction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: '', // Será um string no formato "YYYY-MM-DD"
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
    // formData.date já está no formato "YYYY-MM-DD" pois usamos input type="date"
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
        navigate('/home'); // Redireciona após criar a transação
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
      <form className="create-transaction-form" onSubmit={handleSubmit}>
        <label>
          Tipo:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Valor:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Categoria:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descrição:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Data:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Criar Transação</button>
      </form>
    </div>
  );
}

export default CreateTransaction;
