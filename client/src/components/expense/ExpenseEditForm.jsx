import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { object, string, number, date } from 'yup';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useBudgets } from '../budget/BudgetContext';
import toast from "react-hot-toast";


const validationSchema = object({
  description: string().required('Description is required'),
  amount: number().required('Amount is required').positive('Amount must be positive'),
  date: date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
});

const EditExpenseForm = () => {
  const { getExpenseById, editExpense, deleteExpense, expenses } = useBudgets();
  const { id } = useParams(); 
  const [selectedExpenseId, setSelectedExpenseId] = useState(id || ''); 
  const [expense, setExpense] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedExpenseId) {
      const fetchExpense = async () => {
        const fetchedExpense = await getExpenseById(selectedExpenseId);
        setExpense(fetchedExpense);
      };
      fetchExpense();
    }
  }, [selectedExpenseId, getExpenseById]);

  const handleFormSubmit = async (values) => {
    if (!selectedExpenseId) {
      return; 
    }
    if (
      values.description === expense.description &&
      parseFloat(values.amount) === parseFloat(expense.amount) &&
      values.date === expense.date
    ) {
      toast.error('Please modify at least one field before submitting.');
      return;
    }
    const updatedValues = {
      ...values,
      id: selectedExpenseId,
    };
  
    try {
      await editExpense(updatedValues); 
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Error updating expense. Please try again.');
    }
  };


//   const handleDelete = async () => {
//     if (!selectedExpenseId) {
//       toast.error("No expense selected for deletion.");
//       return;
//     }
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this expense? This action cannot be undone."
//     );
  
//     if (!confirmDelete) return;
  
//     try {
//       await deleteExpense(selectedExpenseId);
//       toast.success("Expense deleted successfully!");
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       toast.error("Failed to delete expense. Please try again.");
//     }
//   };
  

  if (!expense && selectedExpenseId) return <p>Loading expense...</p>;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        description: expense ? expense.description : '',
        amount: expense ? expense.amount : '',
        date: expense ? expense.date : '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {formik => (
        <Form>
          <FormContainer>
            <FormTitle>Edit Expense</FormTitle>
            
            <InputWrapper>
              <Label htmlFor="expense">Select Expense</Label>
              <StyledSelect
                    id="expense"
                    name="expense"
                    value={selectedExpenseId}
                    onChange={(e) => {
                        setSelectedExpenseId(e.target.value);  // Set the selected expense ID
                        const selectedExpense = expenses.find(exp => exp.id === e.target.value);
                        
                        // Update the form values when an expense is selected
                        if (selectedExpense) {
                        formik.setValues({
                            description: selectedExpense.description,
                            amount: selectedExpense.amount,
                            date: selectedExpense.date,
                        });
                        }
                    }}
                    >
                    <option value="">Select an expense</option>
                    {expenses.map((expense) => (
                        <option key={expense.id} value={expense.id}>
                        {expense.description}
                        </option>
                    ))}
                    </StyledSelect>
              <ErrorMessage name="expense" component={ErrorText} />
            </InputWrapper>

            {selectedExpenseId && expense && (
              <>
                <InputWrapper>
                  <Label htmlFor="description">Description</Label>
                  <StyledInput
                    id="description"
                    name="description"
                    placeholder="Enter a description"
                  />
                  <ErrorMessage name="description" component={ErrorText} />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="amount">Amount</Label>
                  <StyledInput
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                  />
                  <ErrorMessage name="amount" component={ErrorText} />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="date">Date</Label>
                  <StyledInput
                    id="date"
                    name="date"
                    type="date"
                  />
                  <ErrorMessage name="date" component={ErrorText} />
                </InputWrapper>
{/* 
                <DeleteButton type="button" onClick={handleDelete}>
                  Delete Expense
                </DeleteButton> */}
              </>
            )}

            <SubmitButton type="submit">Update Expense</SubmitButton>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default EditExpenseForm;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: 50px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #555;
`;

const StyledInput = styled(Field)`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 8px;
  background-color: #fff;
  color: #333;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
`;

const StyledSelect = styled.select`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 8px;
  background-color: #fff;
  color: #333;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

// const DeleteButton = styled.button`
//   padding: 12px;
//   background-color: #e63946;
//   color: #fff;
//   font-size: 16px;
//   font-weight: bold;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   width: 100%;
//   margin-top: 10px;
//   transition: background-color 0.3s ease;
//   &:hover {
//     background-color: #d32f2f;
//   }
// `;
