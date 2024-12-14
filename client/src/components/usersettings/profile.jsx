import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";

const Profile = () => {
  const { currentUser, updateUser, getCookie } = useOutletContext();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState(currentUser?.password || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async () => {
    setError(""); // Reset error message
  
    if (
      name === currentUser.name &&
      email === currentUser.email &&
      password === ""
    ) {
      setError("No changes detected. Please update your credentials.");
      return;
    }
  
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }
  
    const updatedUserData = { name, email };
  
    if (password) {
      updatedUserData.password = password;
    }
  
    try {
      const csrfToken = getCookie("csrf_access_token");
      if (!csrfToken) {
        setError("CSRF token is missing");
        return;
      }
  
      const response = await fetch(`/api/v1/current-user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(updatedUserData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        updateUser(data);
        setName(data.name);
        setEmail(data.email);
        setPassword(""); // Reset password field
        alert("Profile updated successfully!");
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An error occurred while updating your profile.");
    }
  };
  
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (confirmDelete) {
      try {
        const csrfToken = getCookie("csrf_access_token"); // Retrieve CSRF token from cookies
        if (!csrfToken) {
          setError("CSRF token is missing");
          return;
        }
  
        const response = await fetch(`/api/v1/delete-account`, {
          method: "DELETE",
          headers: {
            "X-CSRF-TOKEN": csrfToken, // Add CSRF token to the request headers
          },
        });
  
        if (response.ok) {
          updateUser(null);
          alert("Profile deleted successfully!");
          navigate('/');
        } else {
          setError("Failed to delete profile.");
        }
      } catch (err) {
        setError("An error occurred while deleting your profile.");
      }
    }
  };
  if (!currentUser) {
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
