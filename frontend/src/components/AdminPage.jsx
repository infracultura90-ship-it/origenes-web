import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { Toaster } from './ui/sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(data);
      } catch {
        localStorage.removeItem('admin_token');
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <AdminDashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <AdminLogin onLogin={setUser} />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AdminPage;
