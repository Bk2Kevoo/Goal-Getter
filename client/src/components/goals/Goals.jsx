import styled from "styled-components";
import { useOutletContext, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { number, object, date, string } from "yup";
import * as Yup from "yup";
import { useBudgets } from "../budget/BudgetContext";

const today = new Date();
today.setHours(0, 0, 0, 0); // Set time to midnight

const goalSchema = object({
  name: string()
    .min(3, "Name must be 3 characters or more")
    .required("Name is required"),
  goal_amount: number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  current_savings: number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  start_date: date()
    .required("Start date is required")
    .min(today, "Start date cannot be in the past"), // Use normalized `today`
  end_date: date()
    .required("End date is required")
    .min(Yup.ref("start_date"), "End date cannot be before the start date"),
});

const Goals = ({ initialValues }) => {
  const { getCookie } = useOutletContext();
  const { addGoal } = useBudgets(); 
  const navigate = useNavigate();

 const handleFormSubmit = async (values) => {
    // try {
    //     const csrfToken = getCookie('csrf_access_token');
    //     const response = await fetch('/api/v1/goal/create', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRF-TOKEN': csrfToken,
        //     },
        //     body: JSON.stringify({
        //         name: values.name,
        //         goal_amount: values.goal_amount,
        //         current_savings: values.current_savings,
        //         start_date: values.start_date,
        //         end_date: values.end_date,
        //     }),
        // });

    //     if (response.ok) {
    //         const savedGoal = await response.json();
    //         // Add goal to the state without fetching again
            const status = await addGoal({
              name: values.name,
              goal_amount: values.goal_amount,
              current_savings: values.current_savings,
              start_date: values.start_date,
              end_date: values.end_date,
          });
    //         toast.success("Goal added successfully!");
            if (status === 201) {
              navigate('/dashboard'); // Redirect to the dashboard
            }
    //     } else {
    //         const errorData = await response.json();
    //         toast.error(errorData.error || "Failed to add goal. Please try again!");
    //     }
    // } catch (error) {
    //     console.error('Error submitting form:', error);
    //     toast.error("Failed to submit the form. Please try again!");
    // }
};
  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <Formik
      initialValues={initialValues || {
        name: '',
        goal_amount: '',
        current_savings: '',
        start_date: todayDate,
        end_date: '',
      }}
      validationSchema={goalSchema}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <FormContainer>
          <FormTitle>Add New Goal</FormTitle>
          <InputWrapper>
            <Label htmlFor="name">Name</Label>
            <Field id="name" name="name" type="text" placeholder="Enter your Goal Name ..." />
            <ErrorMessage name="name" component={ErrorText} />
          </InputWrapper>
          <InputWrapper>
          <Label htmlFor="goal_amount">Goal Amount</Label>
          <Field
            id="goal_amount"
            name="goal_amount"
            type="number"
            step="0.01"
            placeholder="Enter a Goal Amount..."
          />
          <ErrorMessage name="goal_amount" component={ErrorText} />
        </InputWrapper>
          <InputWrapper>
            <Label htmlFor="current_savings">Current Savings</Label>
            <Field id="current_savings" name="current_savings" type="number" step="0.01" placeholder="Enter your Current Savings Amount.." />
            <ErrorMessage name="current_savings" component={ErrorText} />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="start_date">Start Date</Label>
            <StyledInput id="start_date" name="start_date" type="date" value={todayDate} readOnly />
            <ErrorMessage name="start_date" component={ErrorText} />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="end_date">End Date</Label>
            <Field id="end_date" name="end_date" type="date" />
            <ErrorMessage name="end_date" component={ErrorText} />
          </InputWrapper>
          <SubmitButton type="submit">Submit</SubmitButton>
        </FormContainer>
      </Form>
    </Formik>
  );
};

export default Goals;

// Styled components
export const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: bold;
`;

export const InputWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
`;

export const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
