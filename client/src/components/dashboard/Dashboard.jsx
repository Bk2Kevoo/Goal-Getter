// import React, { useEffect } from 'react';
import { useBudgets } from '../budget/BudgetContext';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; 

const Dashboard = () => {
    const { budgets, expenses } = useBudgets();

    // Check if budgets and expenses are available
    const budgetLabels = budgets.length > 0 ? budgets.map((budget) => budget.name || `Budget ${budget.id}`) : [];
    const budgetValues = budgets.length > 0 ? budgets.map((budget) => budget.total_amount) : [];

    // Expense chart data labels with totals
    const expenseLabels = expenses.length > 0 
        ? expenses.map((expense) => `${expense.description}: $${expense.amount.toFixed(2)}`)
        : [];
    const expenseValues = expenses.length > 0 
        ? expenses.map((expense) => expense.amount)
        : [];

    // Chart Data for Budgets
    const budgetChartData = {
        labels: budgetLabels,
        datasets: [
            {
                label: 'Budgets',
                data: budgetValues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Chart Data for Expenses
    const expenseChartData = {
        labels: expenseLabels,
        datasets: [
            {
                label: 'Expenses',
                data: expenseValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Check if data is still loading or empty
    if (budgets.length === 0 && expenses.length === 0) {
        return <p>Loading your financial data...</p>; // Loading state
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                {/* Budget Chart */}
                <div style={{ width: '30%', minWidth: '300px' }}>
                    <h2 style={{ textAlign: 'center' }}>Budgets Overview</h2>
                    {budgetLabels.length > 0 ? (
                        <Bar data={budgetChartData} />
                    ) : (
                        <p>No budgets available.</p> 
                    )}
                </div>

                {/* Expense Chart */}
                <div style={{ width: '30%', minWidth: '300px' }}>
                    <h2 style={{ textAlign: 'center' }}>Expenses Breakdown</h2>
                    {expenseLabels.length > 0 ? (
                        <Pie data={expenseChartData} />
                    ) : (
                        <p>No expenses available.</p> 
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
