import { useNavigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './nav/Header';
import toast, { Toaster } from 'react-hot-toast';
import { BudgetProvider } from './budget/BudgetContext';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const fetchCurrentUser = async (getCookie, navigate) => {
  try {
    const resp = await fetch('/api/v1/current-user', {
      headers: {
        'X-CSRF-TOKEN': getCookie('csrf_access_token'),
      },
    });
    const data = await resp.json();
    if (resp.ok) return data;

    const refreshResp = await fetch('/api/v1/refresh', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
      },
    });
    const refreshData = await refreshResp.json();
    if (refreshResp.ok) return refreshData;

    throw new Error(refreshData.error || 'Failed to authenticate.');
  } catch (error) {
    toast.error(error.message || 'An error occurred. Please try again later.');
    navigate('/register');
  }
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchCurrentUser(getCookie, navigate);
      if (user) setCurrentUser(user);
    };

    getUser();
  }, [navigate]);

  const updateUser = (value) => setCurrentUser(value);

  return (
    <BudgetProvider getCookie={getCookie}>
      <Header currentUser={currentUser} updateUser={updateUser} getCookie={getCookie} />
      <Toaster />
      <Outlet context={{ currentUser, updateUser, getCookie }} />
    </BudgetProvider>
  );
}

export default App;
