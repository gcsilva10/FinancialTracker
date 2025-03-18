import React from 'react';
import './TransactionTable.css';

function TransactionTable({ transactions, sortField, sortOrder, onSort, onRowClick, toggleSelect, selectedIds }) {
  return (
    <table className="transaction-table">
      <thead>
        <tr>
          <th>Selecionar</th>
          <th onClick={() => onSort('date')}>
            Data {sortField === 'date' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
          </th>
          <th onClick={() => onSort('type')}>
            Tipo {sortField === 'type' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
          </th>
          <th onClick={() => onSort('category')}>
            Categoria {sortField === 'category' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
          </th>
          <th onClick={() => onSort('description')}>
            Descrição {sortField === 'description' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
          </th>
          <th onClick={() => onSort('amount')}>
            Valor {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr
            key={transaction.id}
            className={`transaction-row ${transaction.type}`}
            onClick={() => onRowClick(transaction.id)}
            style={{ cursor: 'pointer' }}
          >
            <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(transaction.id)}
                  onChange={() => toggleSelect(transaction.id)}
                />
                <span className="custom-checkbox"></span>
              </label>
            </td>
            <td>{transaction.date}</td>
            <td>{transaction.type}</td>
            <td>{transaction.category}</td>
            <td>{transaction.description || '-'}</td>
            <td>{parseFloat(transaction.amount).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
