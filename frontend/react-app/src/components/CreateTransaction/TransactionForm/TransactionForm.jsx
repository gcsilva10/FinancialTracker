// src/components/CreateTransaction/TransactionForm.jsx
import React from 'react';
import './TransactionForm.css';

function TransactionForm({ formData, handleChange, handleSubmit }) {
  return (
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
  );
}

export default TransactionForm;
