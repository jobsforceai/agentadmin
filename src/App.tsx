import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/agents/AgentsPage';
import CreateAgentPage from './pages/agents/CreateAgentPage';
import AgentDetailsPage from './pages/agents/AgentDetailsPage';
import AssignUsersPage from './pages/agents/AssignUsersPage';
import UsersPage from './pages/users/UsersPage';
import UserJobsPage from './pages/users/UserJobsPage';
import UserMeetingsPage from './pages/users/UserMeetingsPage';
import MeetingsPage from './pages/MeetingsPage';
import { useAuthStore } from './store/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard\" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="agents">
            <Route index element={<AgentsPage />} />
            <Route path="create" element={<CreateAgentPage />} />
            <Route path=":agentId" element={<AgentDetailsPage />} />
            <Route path=":agentId/assign-users" element={<AssignUsersPage />} />
          </Route>
          
          <Route path="users">
            <Route index element={<UsersPage />} />
            <Route path=":userId/jobs" element={<UserJobsPage />} />
            <Route path=":userId/meetings" element={<UserMeetingsPage />} />
          </Route>
          
          <Route path="meetings" element={<MeetingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard\" replace />} />
      </Routes>
    </Router>
  );
};

export default App;