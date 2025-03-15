// src/components/TransactionList.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TransactionList.css';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Estados para filtro e ordenação
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Estado para seleção de transações
  const [selectedIds, setSelectedIds] = useState([]);

  // Ref para o input file (para importação)
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/tracker/transactions/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          console.error('Erro ao buscar transações:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [token]);

  // Função para alternar seleção
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Função para apagar as transações selecionadas
  const deleteSelected = async () => {
    if (window.confirm("Tem certeza de que deseja excluir as transações selecionadas?")) {
      try {
        await Promise.all(
          selectedIds.map(id =>
            fetch(`/tracker/api/transactions/${id}/`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
              },
            })
          )
        );
        alert("Transações excluídas com sucesso.");
        // Atualiza a lista de transações
        const response = await fetch('/tracker/transactions/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
        setSelectedIds([]);
      } catch (error) {
        console.error("Erro ao excluir transações:", error);
        alert("Erro ao excluir transações.");
      }
    }
  };

  // Função de filtro
  const filteredTransactions = transactions.filter(transaction => {
    if (!filterCriteria || filterValue.trim() === '') return true;
    let fieldValue;
    switch (filterCriteria) {
      case 'date': fieldValue = transaction.date; break;
      case 'type': fieldValue = transaction.type; break;
      case 'category': fieldValue = transaction.category; break;
      case 'description': fieldValue = transaction.description || ''; break;
      case 'amount': fieldValue = transaction.amount; break;
      default: fieldValue = '';
    }
    return fieldValue.toString().toLowerCase().includes(filterValue.toLowerCase());
  });

  // Ordenação com ciclo: asc -> desc -> sem ordenação
  const handleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder('asc');
    } else {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField('');
        setSortOrder('');
      }
    }
  };

  let sortedTransactions = [...filteredTransactions];
  if (sortField) {
    sortedTransactions.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      if (sortField === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleFilterClick = (criteria) => {
    setFilterCriteria(criteria);
    setFilterValue('');
  };

  // Função para exportar dados para Excel
  const handleExportExcel = async () => {
    try {
      const response = await fetch('/tracker/api/transactions/export/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao exportar dados");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "transacoes.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
      alert("Erro ao exportar dados");
    }
  };

  // Função para disparar o clique do input de arquivo
  const handleImportButtonClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  // Função para enviar o arquivo selecionado para importação
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('/tracker/api/transactions/import/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Importação realizada com sucesso.");
        // Atualiza a lista de transações
        const resp = await fetch('/tracker/transactions/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (resp.ok) {
          const newData = await resp.json();
          setTransactions(newData);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao importar transações.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na requisição de importação.");
    }
  };

  if (loading) {
    return <div className="transaction-loading">Carregando transações...</div>;
  }

  return (
    <div className="transaction-container">
      <h1>Minhas Transações</h1>
      
      <div className="filter-controls">
        <span>Filtrar por:</span>
        <button onClick={() => handleFilterClick('date')}>Data</button>
        <button onClick={() => handleFilterClick('type')}>Tipo</button>
        <button onClick={() => handleFilterClick('category')}>Categoria</button>
        <button onClick={() => handleFilterClick('description')}>Descrição</button>
        <button onClick={() => handleFilterClick('amount')}>Valor</button>
        {filterCriteria && (
          <>
            <input
              type="text"
              placeholder={`Filtrar por ${filterCriteria}`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <button onClick={() => { setFilterCriteria(''); setFilterValue(''); }}>
              Limpar Filtro
            </button>
          </>
        )}
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Selecionar</th>
            <th onClick={() => handleSort('date')}>
              Data {sortField === 'date' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
            </th>
            <th onClick={() => handleSort('type')}>
              Tipo {sortField === 'type' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
            </th>
            <th onClick={() => handleSort('category')}>
              Categoria {sortField === 'category' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
            </th>
            <th onClick={() => handleSort('description')}>
              Descrição {sortField === 'description' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
            </th>
            <th onClick={() => handleSort('amount')}>
              Valor {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : (sortOrder === 'desc' ? '↓' : ''))}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map(transaction => (
            <tr
              key={transaction.id}
              className={`transaction-row ${transaction.type}`}
              onClick={() => navigate(`/transactions/${transaction.id}`)}
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

      <div className="export-delete-container">
        <button className="export-button" onClick={handleExportExcel}>
          Exportar para Excel
        </button>
        <button className="import-button" onClick={handleImportButtonClick}>
          Importar Excel
        </button>
        {selectedIds.length > 0 && (
          <button className="delete-selected-button" onClick={deleteSelected}>
            Apagar Transações Selecionadas
          </button>
        )}
        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default TransactionList;
