import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBudgets } from '../budget/BudgetContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import toast from 'react-hot-toast';
import styled from "styled-components";

// Validation schema for the form
const goalSchema = Yup.object({
    name: Yup.string().min(3, 'Name must be 3 characters or more').required('Name is required'),
    goal_amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    current_savings: Yup.number().required('Amount is required').positive('Amount must be positive'),
    start_date: Yup.date()
        .required('Start date is required')
        .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Start date cannot be in the past'), // Corrected to pass a valid Date object
    end_date: Yup.date()
        .required('End date is required')
        .min(Yup.ref('start_date'), 'End date cannot be before the start date'),
    is_completed: Yup.boolean(),
});

const EditGoal = () => {
    const { id } = useParams(); 
    const { getGoalById, editGoal, deleteGoal } = useBudgets(); 
    const [goal, setGoal] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGoal = async () => {
            const fetchedGoal = await getGoalById(id);
            setGoal(fetchedGoal);
        };
        fetchGoal();
    }, [id, getGoalById]);

    

    const handleSubmit = async (values, { setSubmitting }) => {
        const isCompleted = values.is_completed === "true";
        if (
            values.name === goal.name &&
            values.goal_amount === goal.goal_amount &&
            values.current_savings === goal.current_savings &&
            values.start_date === goal.start_date.split('T')[0] &&
            values.end_date === goal.end_date.split('T')[0] &&
            isCompleted === goal.is_completed
        ) {
            toast.error("No changes detected. Please modify to update.");
            setSubmitting(false); 
            return;
        }

        try {
            await editGoal({ ...values, id, is_completed: isCompleted });
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Error updating goal:', error);
            toast.error("Failed to update goal. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this goal?");
        if (confirmed) {
            try {
                await deleteGoal(id);
                navigate('/dashboard'); 
            } catch (error) {
                console.error('Error deleting goal:', error);
                toast.error("Failed to delete goal. Please try again.");
            }
        }
    };

    if (!goal) return <p>Loading goal...</p>;

    return (
        <FormContainer>
            <FormTitle>Edit Goal</FormTitle>

            <Formik
                initialValues={{
                    name: goal.name,
                    goal_amount: goal.goal_amount,
                    current_savings: goal.current_savings,
                    start_date: goal.start_date.split('T')[0],
                    end_date: goal.end_date.split('T')[0],
                    is_completed: goal.is_completed,
                }}
                validationSchema={goalSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        {/* Form Fields */}
                        <FormField>
                            <Label htmlFor="name">Goal Name</Label>
                            <InputField id="name" name="name" type="text" placeholder="Enter your Goal Name" />
                            <ErrorMessageStyled name="name" component="div" />
                        </FormField>

                        <FormField>
                            <Label htmlFor="goal_amount">Goal Amount</Label>
                            <InputField id="goal_amount" name="goal_amount" type="number" placeholder="Enter your Goal Amount" />
                            <ErrorMessageStyled name="goal_amount" component="div" />
                        </FormField>

                        <FormField>
                            <Label htmlFor="current_savings">Current Savings</Label>
                            <InputField id="current_savings" name="current_savings" type="number" placeholder="Enter your Current Savings" />
                            <ErrorMessageStyled name="current_savings" component="div" />
                        </FormField>

                        <FormField>
                            <Label htmlFor="start_date">Start Date</Label>
                            <InputField id="start_date" name="start_date" type="date" />
                            <ErrorMessageStyled name="start_date" component="div" />
                        </FormField>

                        <FormField>
                        <Label htmlFor="is_completed">Status</Label>
                        <Field as="select" id="is_completed" name="is_completed">
                            <option value={true}>Completed</option>
                            <option value={false}>Not Completed</option>
                        </Field>
                        <ErrorMessageStyled name="is_completed" component="div" />
                    </FormField>

                        {/* Form Buttons */}
                        <ButtonContainer>
                            <SubmitButton type="submit" disabled={isSubmitting}>
                                Update Goal
                            </SubmitButton>
                            <DeleteButton type="button" onClick={handleDelete}>
                                Delete Goal
                            </DeleteButton>
                        </ButtonContainer>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
};

export default EditGoal;

// Styled Components
const FormContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h1`
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
`;

const FormField = styled.div`
    margin-bottom: 1.5rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.4rem;
    font-weight: bold;
    color: #444;
`;

const InputField = styled(Field)`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    color: #333;
`;

// const CheckboxField = styled(Field)`
//     width: auto;
//     margin-right: 0.5rem;
// `;

const ErrorMessageStyled = styled(ErrorMessage)`
    color: red;
    font-size: 0.9rem;
    margin-top: 0.3rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
`;

const SubmitButton = styled.button`
    flex: 1;
    padding: 1rem;
    background-color: #4CAF50;
    color: white;
    font-size: 1.1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const DeleteButton = styled.button`
    flex: 1;
    padding: 1rem;
    background-color: #f44336;
    color: white;
    font-size: 1.1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e53935;
    }
`;
