import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async ({ username, password }) => {
    try {
      if (!username || !password) {
        alert('Username and password are required');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      alert(error.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <AuthForm onSubmit={handleRegister} submitLabel="Register" />
    </div>
  );
}

export default RegisterPage;