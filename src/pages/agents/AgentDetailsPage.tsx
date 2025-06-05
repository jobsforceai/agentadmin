import React from 'react';
import { useParams } from 'react-router-dom';
import AgentDetails from '../../components/agents/AgentDetails';

const AgentDetailsPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  
  if (!agentId) {
    return <div>Agent ID is required</div>;
  }
  
  return (
    <div className="space-y-6">
      <AgentDetails />
    </div>
  );
};

export default AgentDetailsPage;