import styled from "styled-components";
import { useEffect, useState, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik } from "formik";
import { object, string } from "yup";
// import { Modal } from "@mui/base/Modal"


const signupSchema = object({
  name: string().min(3, "name must be 3 characters or more").required("name is required"),
  email: string().email("email must be valid").max(40).required("email is required"),
  password: string().min(7).max(20).required("password is required"),
});

const signinSchema = object({
  email: string().email("email must be valid").max(40).required("email is required"),
  password: string().min(7).max(20).required("password is required"),
});

const Registration = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser, updateUser } = useOutletContext();  
  const navigate = useNavigate();

  const handleGoogleResponse = useCallback(async (response) => {
    const decoded = JSON.parse(atob(response.credential.split(".")[1]));
    const googleUserData = {
      email: decoded.email,
      name: decoded.name,
    };
  
    try {
      const response = await fetch("/api/v1/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleUserData),
      });
      const data = await response.json();
  
      if (response.ok) {
        toast.success (`Welcome, ${data.user.name}!`);
        updateUser(data.user);

      // If initial_sign_up is true then navigate to profile also In the backend I set a password on initial signup, but now in the front end i need it to open up a modal that will allow me to change the password hash that i set 
      
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Google authentication failed!");
      }
    } catch (error) {
      toast.error("Something went wrong with Google Authentication!");
      console.error(error);
    }
  }, [navigate, updateUser]);


  useEffect(() => {
    if (currentUser) { 
      navigate("/dashboard");  
    }
  }, [currentUser, navigate]); 

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: "404538436373-o8q5qka6pikreb68gcvc5cgul7rievpp.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(document.getElementById("google-signin"), {
          theme: "outline",
          size: "large",
        });
      };
      document.body.appendChild(script);
    }
  }, [handleGoogleResponse]); 


  return (
    <Container>
      <Header>
        <h2>{isLogin ? "Welcome Back!" : "Join Us!"}</h2>
        <ToggleButton onClick={() => setIsLogin((current) => !current)}>
          {isLogin ? "Not a Member? Register Here" : "Already a Member? Log In"}
        </ToggleButton>
      </Header>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          const url = isLogin ? "/api/v1/login" : "/api/v1/signup";
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await response.json();
          if (response.ok) {
            toast.success(isLogin ? `Welcome back, ${data.name}!` : `Welcome, ${data.name}!`);
            updateUser(data);
            navigate("/dashboard");
          } else {
            toast.error(data.error);
          }
        }}
        validationSchema={isLogin ? signinSchema : signupSchema}
      >
        {({ handleBlur, handleChange, handleSubmit, values, errors, touched }) => (
          <StyledForm onSubmit={handleSubmit}>
            {!isLogin && (
              <FormField>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
                {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormField>
            )}
            <FormField>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
              {errors.email && touched.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormField>
            <FormField>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
              {errors.password && touched.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormField>
            <SubmitButton type="submit">{isLogin ? "Log In" : "Sign Up"}</SubmitButton>
          </StyledForm>
        )}
      </Formik>

      <Divider>OR</Divider>
      <div id="google-signin" style={{ textAlign: "center" }}></div>
    </Container>
  );
};

export default Registration;

// Styled Components
const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  h2 {
    margin-bottom: 10px;
    color: #333;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormField = styled.div`
  margin-bottom: 15px;
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0;
  font-weight: bold;
  color: #999;
`;