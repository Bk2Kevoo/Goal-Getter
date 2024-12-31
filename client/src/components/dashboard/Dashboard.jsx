import React, { useEffect } from 'react';
import { useBudgets } from '../budget/BudgetContext';
import { Pie } from 'react-chartjs-2'; // Assuming you're using Pie chart for expenses
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto'; // For chart.js to work

const Dashboard = () => {
    const { budgets, expenses, goals, fetchExpenses, fetchGoals } = useBudgets(); // Assuming goals are part of the context
    const navigate = useNavigate();

    // Fetch data only when necessary (i.e., on component mount)
    useEffect(() => {
        if (expenses.length === 0) fetchExpenses();
        if (goals.length === 0) fetchGoals();
    }, [expenses, goals, fetchExpenses, fetchGoals]);

    // Check if data is still loading or empty
    if (budgets.length === 0 && expenses.length === 0 && goals.length === 0) {
        return <p>Loading your financial data...</p>; // Loading state
    }

    // Expense chart data labels with totals
    const expenseLabels = expenses.length > 0 
        ? expenses.map((expense) => `${expense.description}: $${expense.amount.toFixed(2)}`)
        : ['No Expenses']; // Label for when there's no data
    const expenseValues = expenses.length > 0 
        ? expenses.map((expense) => expense.amount)
        : [1]; // One value to show in the chart when no expenses

    // Chart Data for Expenses
    const expenseChartData = {
        labels: expenseLabels,
        datasets: [
            {
                label: 'Expenses Breakdown',
                data: expenseValues,
                backgroundColor: expenses.length > 0 
                    ? [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ]
                    : ['rgba(211, 211, 211, 0.6)'], // Light grey for empty state
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                
                {/* Expenses Section */}
                <div style={{ width: '30%', minWidth: '300px' }}>
                    <h2 style={{ textAlign: 'center' }}>Expenses Breakdown</h2>
                    <Pie data={expenseChartData} />
                </div>

                {/* Goals Section - Card Layout */}
                <div style={{ width: '50%', minWidth: '500px' }}>
                    <h2 style={{ textAlign: 'center' }}>Goals Overview</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                        {goals.length > 0 ? (
                            goals.map((goal) => {
                                const progress = (goal.current_savings / goal.goal_amount) * 100;
                                return (
                                    <div key={goal.id} style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        padding: '1.5rem',
                                        width: '250px',
                                        textAlign: 'center',
                                        transition: 'transform 0.3s ease',
                                    }}>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{goal.name}</h3>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span style={{
                                                fontSize: '1.4rem',
                                                fontWeight: 'bold',
                                                color: progress === 100 ? 'green' : '#ff4500',
                                            }}>
                                                {progress.toFixed(2)}%
                                            </span>
                                            <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', marginTop: '0.5rem' }}>
                                                <div style={{
                                                    width: `${progress}%`,
                                                    height: '100%',
                                                    backgroundColor: progress === 100 ? 'green' : '#ff4500',
                                                    borderRadius: '4px',
                                                }}></div>
                                            </div>
                                        </div>
                                        <p><strong>Current Savings:</strong> ${goal.current_savings.toFixed(2)}</p>
                                        <p><strong>Goal Amount:</strong> ${goal.goal_amount.toFixed(2)}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No goals set.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Expense Button */}
            <button 
                style={{ 
                    display: 'block', 
                    margin: '2rem auto', 
                    padding: '0.5rem 1rem', 
                    fontSize: '1rem', 
                    cursor: 'pointer' 
                }} 
                onClick={() => navigate('/expenses/new')}>
                Add an Expense
            </button>

            {/* Add Goal Button */}
            <button 
                style={{ 
                    display: 'block', 
                    margin: '2rem auto', 
                    padding: '0.5rem 1rem', 
                    fontSize: '1rem', 
                    cursor: 'pointer' 
                }} 
                onClick={() => navigate('/goals/new')}>
                Set a New Goal
            </button>
        </div>
    );
};

export default Dashboard;
