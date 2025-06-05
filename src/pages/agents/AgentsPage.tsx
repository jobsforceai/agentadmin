import React from 'react';
import AgentList from '../../components/agents/AgentList';

const AgentsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Agents Management</h1>
      <AgentList />
    </div>
  );
};

export default AgentsPage;