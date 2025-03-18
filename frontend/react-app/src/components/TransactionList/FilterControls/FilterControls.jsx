import React from 'react';
import './FilterControls.css';

function FilterControls({ filterCriteria, filterValue, onFilterClick, onFilterChange, onClearFilter }) {
  return (
    <div className="filter-controls">
      <span>Filtrar por:</span>
      <button onClick={() => onFilterClick('date')}>Data</button>
      <button onClick={() => onFilterClick('type')}>Tipo</button>
      <button onClick={() => onFilterClick('category')}>Categoria</button>
      <button onClick={() => onFilterClick('description')}>Descrição</button>
      <button onClick={() => onFilterClick('amount')}>Valor</button>
      {filterCriteria && (
        <>
          <input
            type="text"
            placeholder={`Filtrar por ${filterCriteria}`}
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
          />
          <button onClick={onClearFilter}>Limpar Filtro</button>
        </>
      )}
    </div>
  );
}

export default FilterControls;
