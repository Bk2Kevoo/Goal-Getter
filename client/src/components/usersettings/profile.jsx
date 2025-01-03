import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import toast from 'react-hot-toast';


  const Profile = () => {
    const { currentUser, updateUser, getCookie } = useOutletContext();
    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState(currentUser?.password || "");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      if (currentUser) {
        setIsLoading(false);
      }
    }, [currentUser]);

    const handleUpdate = async () => {
      setError("");
      
      if (!name || !email) return setError("Name and email are required.");
      
      // Check if name, email, and password (if provided) have changed
      if (
        name === currentUser.name &&
        email === currentUser.email &&
        password === ""  // No password change
      ) {
        return setError("No changes detected. Please update your credentials.");
      }
    
      const updatedUserData = { name, email, ...(password && { password }) };
    
      try {
        const csrfToken = getCookie("csrf_access_token");
        if (!csrfToken) return setError("CSRF token is missing");
    
        const response = await fetch(`/api/v1/current-user/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify(updatedUserData),
        });
    
        const data = await response.json();
    
        if (!response.ok) throw new Error(data.error || "Failed to update profile.");
    
        // Update global and local state
        updateUser(data); // Updates the shared context
        setName(data.name);
        setEmail(data.email);
        setPassword(""); // Clear the password input
    
        toast.success("Profile updated successfully!");
      } catch (err) {
        setError(err.message || "An error occurred while updating your profile.");
      }
    };
    

    const handleDelete = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
      if (confirmDelete) {
        try {
          const csrfToken = getCookie("csrf_access_token");
          if (!csrfToken) {
            setError("Session expired. Redirecting to login...");
            setTimeout(() => navigate("/login"), 3000);
            return;
          }

          const response = await fetch(`/api/v1/delete-account`, {
            method: "DELETE",
            headers: {
              "X-CSRF-TOKEN": csrfToken,
            },
          });

          if (response.ok) {
            updateUser(null);
            localStorage.removeItem("currentUser");
            toast.success("Profile deleted successfully!");
            navigate("/about");
          } else {
            const data = await response.json();
            setError(data.error || "Failed to delete profile.");
          }
        } catch (err) {
          setError("An error occurred while deleting your profile.");
        }
      }
    };

    if (isLoading) {
      return <div>Loading user information...</div>;
    }

    return (
      <ProfileContainer>
        <Title>Profile</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <FormGroup>
            <Label>Name:</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Button type="submit">Update Profile</Button>
        </Form>
        <DeleteButton onClick={handleDelete}>Delete Profile</DeleteButton>
      </ProfileContainer>
    );
  };

  export default Profile;


// Styled Components
const ProfileContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  color: #333;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #555;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background-color: #d9534f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #c9302c;
  }
`;