import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from "react-hot-toast"

    
    export const BudgetContext = createContext();
    
    export const BudgetProvider = ({ children }) => {
        const [ budgets, setBudgets ] = useState([]);
        const [ expenses, setExpenses ] = useState([]);

        useEffect(() => {
            fetchBudgets();
            fetchExpenses();
        }, []);

        const fetchBudgets = async () => {
            try {
                const response = await fetch("/api/v1/budgets");
                const data = await response.json();
                setBudgets(data);
            } catch (error) {
                console.error("Error fetching budgets", error)
                toast.error("Failed to fetch budgets. Please try again!");
            }
        };

        const fetchExpenses = async () => {
            try {
                const response = await fetch("/api/v1/expenses");
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error("Error fetching expenses", error)
                toast.error("Failed to fetch expenses. Please try again!");
                
            }
        };
        
        const addBudget = async (newBudget) => {
            try {
                const response = await fetch("/api/v1/budgets/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(newBudget),
                });
                const savedBudget = await response.json();
                setBudgets((prev) => [...prev, savedBudget]);
            } catch (error) {
                console.log("Error adding budget", error)
                toast.error("Failed to add budget. Please try again!");
            }
        }

        const addExpense = async (newExpense) => {
            try {
                const response = await fetch("/api/v1/expenses/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(newExpense),
                });
                const savedExpense = await response.json();
                setExpenses((prev) => [...prev, savedExpense]);
            } catch (error) {
                console.log("Error adding expense", error)
                toast.error("Failed to add expense. Please try again!");
            }
        }

        const editBudget = async (updatedBudget) => {
            try {
                const response = await fetch(`/api/v1/budgets/${updatedBudget.id}/update`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(updatedBudget),
                });
                const savedBudget = await response.json();
                setBudgets((prev) => 
                    prev.map((budget) => 
                        budget.id === savedBudget.id ? savedBudget : budget
                    )
                );
            } catch (error) {
                console.log("Error editing budget", error)
                toast.error("Failed to update budget. Please try again!");
            }
        }

        const editExpense = async (updateExpense) => {
            try {
                const response = await fetch(`/api/v1/expenses/${updateExpense.id}/update`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(updateExpense),
                });
                const savedExpense = await response.json();
                setExpenses((prev) => 
                    prev.map((expense) => 
                        expense.id === savedExpense.id ? savedExpense : expense
                    )
                );
                toast.success("Expense updated successfully!");
            } catch (error) {
                console.log("Error editing expense", error)
                toast.error("Failed to update expense. Please try again!");
            }
        }
    
    return (
        <BudgetContext.Provider
          value={{
            budgets,
            expenses,
            addBudget,
            addExpense,
            editBudget,
            editExpense,
          }}
        >
          {children}
        </BudgetContext.Provider>
      );
    };
    
    // Custom hook to consume the ProjectContext easily
    export const useBudgets = () => useContext(BudgetContext);


