
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PublicView from './pages/PublicView';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import InformasiPage from './pages/InformasiPage'; // Import halaman baru
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/data" 
            element={
              <ErrorBoundary>
                <PublicView />
              </ErrorBoundary>
            } 
          />
          <Route path="/informasi" element={<InformasiPage />} /> {/* Tambahkan rute baru */}
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AdminDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default App;