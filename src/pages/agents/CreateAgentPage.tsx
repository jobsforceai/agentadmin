import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import AgentForm from '../../components/agents/AgentForm';

const CreateAgentPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/agents');
  };
  
  const handleCancel = () => {
    navigate('/agents');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Agent</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Agent Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAgentPage;