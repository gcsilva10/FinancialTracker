import React from 'react';
import './StatsCards.css';

function StatsCards({ balance, totalIncome, totalExpense }) {
  return (
    <div className="stats-cards">
      <div className={`card balance ${balance < 0 ? 'negative' : ''}`}>
        <h3>Balanço</h3>
        <p>{balance.toFixed(2)} €</p>
      </div>
      <div className="card income">
        <h3>Total de Receitas</h3>
        <p>{totalIncome.toFixed(2)} €</p>
      </div>
      <div className="card expense">
        <h3>Total de Despesas</h3>
        <p>{totalExpense.toFixed(2)} €</p>
      </div>
    </div>
  );
}

export default StatsCards;
