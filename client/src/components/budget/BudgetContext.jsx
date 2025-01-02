import React, { createContext, useState, useContext } from 'react';
import toast from "react-hot-toast";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children, getCookie }) => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [goals, setGoals] = useState([]);
    
    // States to track if the data has been fetched
    const [budgetsFetched, setBudgetsFetched] = useState(false);
    const [expensesFetched, setExpensesFetched] = useState(false);
    const [goalsFetched, setGoalsFetched] = useState(false);

    const fetchBudgets = async () => {
        if (budgetsFetched) return; // Skip if already fetched
        try {
            const response = await fetch("/api/v1/budgets");
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data); // Debug the response structure
            setBudgets(data.budgets || []); // Fallback to an empty array
            setBudgetsFetched(true);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };

    const fetchExpenses = async () => {
        if (expensesFetched) return; // Skip if already fetched
        try {
            const response = await fetch("/api/v1/expenses");
            const data = await response.json();
            setExpenses(data);
            setExpensesFetched(true); 
        } catch (error) {
            console.error("Error fetching expenses", error);
            toast.error("Failed to fetch expenses. Please try again!");
        }
    };
    const fetchGoals = async () => {
        if (goalsFetched) return; // Skip if already fetched
        try {
            const response = await fetch("/api/v1/goals");
            const data = await response.json();
            setGoals(data);
            setGoalsFetched(true); 
        } catch (error) {
            console.error("Error fetching expenses", error);
            toast.error("Failed to fetch expenses. Please try again!");
        }
    };

    
    const addBudget = async (newBudget) => {
        try {
            const response = await fetch("/api/v1/budgets/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBudget),
            });
            const savedBudget = await response.json();
            setBudgets((prev) => [...prev, savedBudget]);
        } catch (error) {
            console.log("Error adding budget", error);
            toast.error("Failed to add budget. Please try again!");
        }
    };

    const addExpense = async (expense) => {
        try {
            const response = await fetch('/api/v1/expenses/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                },
                credentials: 'include',
                body: JSON.stringify(expense),
              });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error);
            }
            setExpenses((prev) => [data, ...prev])
          }catch (error){
            toast.error(error);
          }
        }

      

    const addGoal = async (newGoal) => {
    const token = getCookie('authToken');  // Get token from cookies
    try {
        const response = await fetch("/api/v1/goal/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,  // Include token in Authorization header
                'X-CSRF-TOKEN': getCookie('csrf_access_token'),
            },
            body: JSON.stringify(newGoal),
        });
        if (!response.ok) {
            throw new Error('Failed to add goal');
        }
        const savedGoal = await response.json();
        setGoals((prev) => [...prev, savedGoal]);
        return 201
    } catch (error) {
        toast.error("Failed to add goal. Please try again!")
        return 400;
    }
};

    const editBudget = async (updatedBudget) => {
        try {
            const response = await fetch(`/api/v1/budgets/${updatedBudget.id}/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBudget),
            });
            const savedBudget = await response.json();
            setBudgets((prev) =>
                prev.map((budget) =>
                    budget.id === savedBudget.id ? savedBudget : budget
                )
            );
        } catch (error) {
            console.log("Error editing budget", error);
            toast.error("Failed to update budget. Please try again!");
        }
    };

    const editExpense = async (updatedExpense) => {
        try {
            const response = await fetch(`/api/v1/expenses/${updatedExpense.id}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': getCookie('csrf_access_token'),
                    },
                
                body: JSON.stringify(updatedExpense),
            });
            const savedExpense = await response.json();
            setExpenses((prev) =>
                prev.map((expense) =>
                    expense.id === savedExpense.id ? savedExpense : expense
                )
            );
            toast.success("Expense updated successfully!");
        } catch (error) {
            console.log("Error editing expense", error);
            toast.error("Failed to update expense. Please try again!");
        }
    };

    const editGoal = async (updatedGoal) => {
        try {
            const token = getCookie('authToken');
            const response = await fetch(`/api/v1/goals/${updatedGoal.id}/update`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,  // Add Authorization header with Bearer token
                    'X-CSRF-TOKEN': getCookie('csrf_access_token')
                },
                body: JSON.stringify(updatedGoal),
                });
            const savedGoal = await response.json();
            setGoals((prev) =>
                prev.map((goal) =>
                    goal.id === savedGoal.id ? savedGoal : goal
                )
            );
            toast.success("Goal updated successfully!");
        } catch (error) {
            console.log("Error editing goal", error);
            toast.error("Failed to update goal. Please try again!");
        }
    };

    const getGoalById = async (goalId) => {
        try {
          const response = await fetch(`/api/v1/goals/${goalId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch goal: ${response.statusText}`);
          }
      
          const goal = await response.json();
          return goal;
        } catch (error) {
          console.error("Error fetching goal by ID:", error);
          throw error;
        }
      };

      const deleteGoal = async (goalId) => {
        try {
            const token = getCookie("authToken"); // Authentication token
            const csrfToken = getCookie("csrf_access_token"); // CSRF token
    
            const response = await fetch(`/api/v1/goals/${goalId}/delete`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken, // Add CSRF token here
                },
                credentials: "include", 
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete goal");
            }
    
            const result = await response.json();
            toast.success("Goal deleted and cookies cleared successfully!");
            return result;
        } catch (error) {
            console.error("Error deleting goal:", error);
            toast.error("Failed to delete goal. Please try again!");
            throw error; // Re-throw to handle in the caller
        }
    };
    return (
        <BudgetContext.Provider
            value={{
                budgets,
                expenses,
                goals,
                addBudget,
                addExpense,
                addGoal,
                editBudget,
                editExpense,
                editGoal,
                fetchBudgets,  
                fetchExpenses, 
                fetchGoals,    
                getGoalById,
                deleteGoal,
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
};

// Custom hook to consume the BudgetContext easily
export const useBudgets = () => useContext(BudgetContext);