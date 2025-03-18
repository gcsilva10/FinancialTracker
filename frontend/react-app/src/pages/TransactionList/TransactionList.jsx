import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterControls from '../../components/TransactionList/FilterControls/FilterControls';
import TransactionTable from '../../components/TransactionList/TransactionTable/TransactionTable';
import ExportImportControls from '../../components/TransactionList/ExportImportControls/ExportImportControls';
import DeleteTransactionsButton from '../../components/TransactionList/DeleteTransactionsButton/DeleteTransactionsButton';
import './TransactionList.css';

function TransactionList() {
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Estados para filtro, ordenação e seleção
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
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

  // Alterna a seleção de uma transação
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Apaga as transações selecionadas
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

  // Filtro
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

  // Ordenação
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

  const clearFilter = () => {
    setFilterCriteria('');
    setFilterValue('');
  };

  // Exportação para Excel
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

  // Importação
  const handleImportButtonClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

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
      <FilterControls 
        filterCriteria={filterCriteria}
        filterValue={filterValue}
        onFilterClick={handleFilterClick}
        onFilterChange={setFilterValue}
        onClearFilter={clearFilter}
      />
      <TransactionTable 
        transactions={sortedTransactions}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(id) => navigate(`/transactions/${id}`)}
        toggleSelect={toggleSelect}
        selectedIds={selectedIds}
      />
      <ExportImportControls 
        onExportExcel={handleExportExcel}
        onImportButtonClick={handleImportButtonClick}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
      />
      <DeleteTransactionsButton 
        onDeleteSelected={deleteSelected}
        selectedIds={selectedIds}
      />
    </div>
  );
}

export default TransactionList;
