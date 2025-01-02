import React, { useEffect } from 'react';
import { useBudgets } from '../budget/BudgetContext';
import { Pie } from 'react-chartjs-2'; 
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto'; 

const Dashboard = () => {
    const { budgets, expenses, goals, fetchExpenses, fetchGoals, fetchBudgets } = useBudgets();
    const navigate = useNavigate();

    useEffect(() => {
        if (expenses.length === 0) fetchExpenses();
        if (goals.length === 0) fetchGoals();
        fetchBudgets(); 
    }, [expenses, goals, fetchExpenses, fetchGoals, fetchBudgets]);

    if (budgets.length === 0 && expenses.length === 0 && goals.length === 0) {
        return <p>Loading your financial data...</p>; 
    }

    const expenseLabels = expenses.length > 0
        ? expenses.map((expense) => `${expense.description}: $${expense.amount.toFixed(2)}`)
        : ['No Expenses']; 
    const expenseValues = expenses.length > 0
        ? expenses.map((expense) => expense.amount)
        : [1]; 

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
                    : ['rgba(211, 211, 211, 0.6)'], 
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ width: '30%', minWidth: '300px' }}>
                    <h2 style={{ textAlign: 'center' }}>Expenses Breakdown</h2>
                    <Pie data={expenseChartData} />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/expenses/new')}
                        >
                            Add an Expense
                        </button>
                        {expenses.length > 0 && (
                            <button
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/expenses/update`)} // Navigate to edit the first expense
                            >
                                Edit an Expense
                            </button>
                        )}
                    </div>
                </div>
                <div style={{ width: '50%', minWidth: '500px' }}>
                    <h2 style={{ textAlign: 'center' }}>Goals Overview</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                        {goals.length > 0 ? (
                            goals.map((goal) => {
                                const progress = (goal.current_savings / goal.goal_amount) * 100;
                                return (
                                    <div
                                        key={goal.id}
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            padding: '1.5rem',
                                            width: '250px',
                                            textAlign: 'center',
                                            position: 'relative',
                                        }}
                                    >
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
                                        <p><strong>Is Completed:</strong> {goal.is_completed ? 'Completed' : 'Not Completed'}</p><span
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                cursor: 'pointer',
                                                fontSize: '1.5rem',
                                                color: '#007bff',
                                            }}
                                            title="Edit Goal"
                                            onClick={() => navigate(`/goals/${goal.id}/update`)}
                                        >
                                            ✏️
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No goals set.</p>
                        )}
                    </div>
                    <button
                        style={{
                            display: 'block',
                            margin: '1rem auto',
                            padding: '0.5rem 1rem',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/goals/new')}
                    >
                        Set a New Goal
                    </button>
                </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
                <h2 style={{ textAlign: 'center' }}>Budgets Overview</h2>
                <table style={{ width: '80%', margin: '2rem auto', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Budget Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Amount</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Start Date</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>End Date</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.length > 0 ? (
                            budgets.map((budget) => (
                                <tr key={budget.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{budget.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>${budget.total_amount.toFixed(2)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{budget.description}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(budget.start_date).toLocaleDateString()}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(budget.end_date).toLocaleDateString()}</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        color: budget.is_active ? 'green' : 'red',
                                    }}>
                                        {budget.is_active ? 'Active' : 'Inactive'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '8px' }}>No budgets available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
