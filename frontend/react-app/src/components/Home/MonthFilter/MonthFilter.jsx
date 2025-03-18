import React from 'react';
import './MonthFilter.css';

function MonthFilter({ selectedMonthYear, setSelectedMonthYear }) {
  return (
    <div className="month-filter">
      <input
        type="month"
        id="monthInput"
        value={selectedMonthYear}
        onChange={(e) => setSelectedMonthYear(e.target.value)}
      />
      <button onClick={() => setSelectedMonthYear("")}>Limpar Filtro</button>
    </div>
  );
}

export default MonthFilter;
