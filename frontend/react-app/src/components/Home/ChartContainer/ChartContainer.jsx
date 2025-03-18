import React from 'react';
import './ChartContainer.css';

function ChartContainer({ title, children }) {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <div className="chart-inner">
        {children}
      </div>
    </div>
  );
}

export default ChartContainer;
