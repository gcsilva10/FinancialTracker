import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import MonthFilter from '../../components/Home/MonthFilter/MonthFilter';
import StatsCards from '../../components/Home/StatsCards/StatsCards';
import ChartContainer from '../../components/Home/ChartContainer/ChartContainer';
import DeleteAccountButton from '../../components/Home/DeleteAccountButton/DeleteAccountButton';
import PieChart from '../../components/Home/PieChart/PieChart';
import BarChart from '../../components/Home/BarChart/BarChart';
import LineChart from '../../components/Home/LineChart/LineChart';
import './HomePage.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
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

  // Cálculo dos totais
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

  // Dados para o gráfico de Pizza
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

  // Dados para o gráfico de Barras
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

  // Dados para o gráfico de Linha (se mês selecionado)
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
      <h1>Estatísticas Financeiras</h1>
      
      <MonthFilter 
        selectedMonthYear={selectedMonthYear} 
        setSelectedMonthYear={setSelectedMonthYear} 
      />

      <StatsCards 
        balance={balance} 
        totalIncome={totalIncome} 
        totalExpense={totalExpense} 
      />

      {transactions.length > 0 && (
        <div className="charts">
          <ChartContainer title="Receitas vs Despesas">
            <PieChart 
              data={pieChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#fff' } } }
              }} 
            />
          </ChartContainer>
          <ChartContainer title="Transações por Categoria">
            <BarChart 
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#fff' } } },
                scales: {
                  x: { ticks: { color: '#fff' } },
                  y: { ticks: { color: '#fff' } }
                }
              }}
            />
          </ChartContainer>
          {selectedMonthYear && lineChartData && (
            <ChartContainer title="Evolução do Balanço (por dia)">
              <LineChart 
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#fff' } } },
                  scales: {
                    x: { ticks: { color: '#fff' } },
                    y: { ticks: { color: '#fff' } }
                  }
                }}
              />
            </ChartContainer>
          )}
        </div>
      )}

      <DeleteAccountButton onDelete={handleDeleteAccount} />
    </div>
  );
}

export default HomePage;
