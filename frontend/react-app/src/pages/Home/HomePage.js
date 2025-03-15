// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, 
  CategoryScale, LinearScale, BarElement, LineElement, PointElement 
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [selectedMonthYear, setSelectedMonthYear] = useState(""); // formato "YYYY-MM"
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        let url = '/tracker/transactions/';
        if (selectedMonthYear !== "") {
          url = `/tracker/api/transactions/by_month/?month=${selectedMonthYear}`;
        }
        const response = await fetch(url, {
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
  }, [token, selectedMonthYear]);

  // Calcula os totais
  let totalIncome = 0;
  let totalExpense = 0;
  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.amount);
    if (transaction.type === 'income') {
      totalIncome += amount;
    } else if (transaction.type === 'expense') {
      totalExpense += amount;
    }
  });
  const balance = totalIncome - totalExpense;

  // Gráfico de Pizza: Total Income vs Total Expense
  const pieChartData = {
    labels: ['Total Income', 'Total Expense'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ['#2575fc', '#FF0000'],
        hoverBackgroundColor: ['#1a5bcc', '#8B0000']
      }
    ]
  };

  // Gráfico de Barras: Transações por Categoria
  const categories = [...new Set(transactions.map(t => t.category))];
  const incomePerCategory = categories.map(cat =>
    transactions
      .filter(t => t.category === cat && t.type === 'income')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0)
  );
  const expensePerCategory = categories.map(cat =>
    transactions
      .filter(t => t.category === cat && t.type === 'expense')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0)
  );
  const barChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Income',
        data: incomePerCategory,
        backgroundColor: '#2575fc',
        hoverBackgroundColor: '#1a5bcc'
      },
      {
        label: 'Expense',
        data: expensePerCategory,
        backgroundColor: '#FF0000',
        hoverBackgroundColor: '#8B0000'
      }
    ]
  };

  // Gráfico de Linha: Evolução do Balanço Acumulado (somente se um mês estiver selecionado)
  let lineChartData = null;
  if (selectedMonthYear) {
    const [yearStr, monthStr] = selectedMonthYear.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    let balanceByDay = [];
    daysArray.forEach(day => {
      const dayTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getDate() === day;
      });
      const dayIncome = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);
      const dayExpense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);
      balanceByDay.push(dayIncome - dayExpense);
    });
    const accumulatedBalance = balanceByDay.map((value, i) =>
      balanceByDay.slice(0, i + 1).reduce((acc, v) => acc + v, 0)
    );
    lineChartData = {
      labels: daysArray,
      datasets: [
        {
          label: 'Balanço Acumulado',
          data: accumulatedBalance,
          fill: false,
          borderColor: '#2575fc',
          tension: 0.1,
        }
      ]
    };
  }

  // Função para apagar a conta
  const handleDeleteAccount = async () => {
    if (window.confirm("Tem certeza de que deseja excluir sua conta? Todos os seus dados serão apagados.")) {
      try {
        const response = await fetch('/api/users/delete/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          alert("Conta deletada com sucesso.");
          localStorage.removeItem('token');
          navigate('/');
        } else {
          const data = await response.json();
          alert(data.error || "Erro ao deletar conta.");
        }
      } catch (error) {
        console.error("Erro ao deletar conta:", error);
        alert("Erro na requisição.");
      }
    }
  };

  if (loading) {
    return <div className="homepage-loading">Carregando...</div>;
  }

  return (
    <div className="homepage-container">
      <h1>HomePage</h1>
      <h2>Estatísticas Financeiras</h2>
      
      <div className="month-filter">
        <label htmlFor="monthInput">Filtrar por Mês/Ano:</label>
        <input
          type="month"
          id="monthInput"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
        />
        <button onClick={() => setSelectedMonthYear("")}>Limpar Filtro</button>
      </div>

      <div className="stats-cards">
        <div className={`card balance ${balance < 0 ? 'negative' : ''}`}>
          <h3>Balanço</h3>
          <p>{balance.toFixed(2)}</p>
        </div>
        <div className="card income">
          <h3>Total Income</h3>
          <p>{totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expense">
          <h3>Total Expense</h3>
          <p>{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Renderiza os gráficos apenas se houver alguma transação */}
      {transactions.length > 0 && (
        <div className="charts">
          <div className="chart-container">
            <h3>Receitas vs Despesas</h3>
            <div className="chart-inner">
              <Pie 
                data={pieChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#fff' } }
                  }
                }} 
              />
            </div>
          </div>
          <div className="chart-container">
            <h3>Transações por Categoria</h3>
            <div className="chart-inner">
              <Bar 
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#fff' } }
                  },
                  scales: {
                    x: { ticks: { color: '#fff' } },
                    y: { ticks: { color: '#fff' } }
                  }
                }}
              />
            </div>
          </div>
          {selectedMonthYear && lineChartData && (
            <div className="chart-container">
              <h3>Evolução do Balanço (por dia)</h3>
              <div className="chart-inner">
                <Line 
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: '#fff' } }
                    },
                    scales: {
                      x: { ticks: { color: '#fff' } },
                      y: { ticks: { color: '#fff' } }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="delete-account-container">
        <button className="delete-account-button" onClick={handleDeleteAccount}>
          Apagar Minha Conta
        </button>
      </div>
    </div>
  );
}

export default HomePage;
