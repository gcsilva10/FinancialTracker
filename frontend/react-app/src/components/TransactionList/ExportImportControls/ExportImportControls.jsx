import React from 'react';
import './ExportImportControls.css';

function ExportImportControls({ onExportExcel, onImportButtonClick, fileInputRef, onFileChange }) {
  return (
    <div className="export-import-container">
      <button className="export-button" onClick={onExportExcel}>
        Exportar para Excel
      </button>
      <button className="import-button" onClick={onImportButtonClick}>
        Importar Excel
      </button>
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </div>
  );
}

export default ExportImportControls;
