import React from 'react';
import { useBudgets } from '../budget/BudgetContext';

const BudgetList = () => {
    const { budgets } = useBudgets(); 

    return (
        <div>
            <h2>Budgets List</h2>
            {budgets.length > 0 ? (
                <ul>
                    {budgets.map((budget) => (
                        <li key={budget.id}>
                            <h3>{budget.name}</h3>
                            <p>{budget.description}</p>
                            <p>Total Amount: ${budget.total_amount}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No budgets available.</p>
            )}
        </div>
    );
};

export default BudgetList;
