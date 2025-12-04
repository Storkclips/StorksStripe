import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SuccessPage from './pages/SuccessPage';
import AlertsPage from './pages/AlertsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AlertsTestPage from './pages/AlertsTestPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import VerifyPasswordChangePage from './pages/VerifyPasswordChangePage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/verify-password-change" element={<VerifyPasswordChangePage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AlertsTestPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AdminSettingsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;