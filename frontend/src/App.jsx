import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import ExpenseForm from './components/Expense/ExpenseForm';
import Categories from './components/Settings/Categories';
import Budgets from './components/Settings/Budgets';
import Reports from './components/Reports/Reports';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/Layout/AppLayout';
import SettingsIndex from './components/Settings/SettingsIndex';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-expense" element={<ExpenseForm />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<SettingsIndex />} />
              <Route path="settings/categories" element={<Categories />} />
              <Route path="settings/budgets" element={<Budgets />} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;