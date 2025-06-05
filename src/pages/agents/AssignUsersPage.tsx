import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import UserSearch from '../../components/users/UserSearch';
import { useAgentsStore } from '../../store/agents';
import { useUsersStore } from '../../store/users';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

const AssignUsersPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { selectedAgent, getAgentById } = useAgentsStore();
  const { assignUsers, isLoading } = useUsersStore();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  
  React.useEffect(() => {
    if (agentId) {
      getAgentById(agentId);
    }
  }, [agentId, getAgentById]);
  
  const handleSelectUsers = (userIds: string[]) => {
    setSelectedUserIds(userIds);
  };
  
  const handleAssignUsers = async () => {
    if (!agentId || selectedUserIds.length === 0) return;
    
    const success = await assignUsers({
      agentId,
      userIds: selectedUserIds
    });
    
    if (success) {
      toast.success(`${selectedUserIds.length} users assigned to agent successfully`);
      navigate(`/agents/${agentId}`);
    } else {
      toast.error('Failed to assign users to agent');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Assign Users to Agent</h1>
        {selectedUserIds.length > 0 && (
          <Button onClick={handleAssignUsers} isLoading={isLoading}>
            Assign {selectedUserIds.length} Users
          </Button>
        )}
      </div>
      
      {selectedAgent && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selected Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="font-medium text-lg text-gray-900">{selectedAgent.username}</p>
                <p className="text-gray-500">{selectedAgent.email}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  selectedAgent.role === 'selfapply' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedAgent.role === 'selfapply' ? 'Self Apply' : 'User Apply'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <UserSearch onSelectUsers={handleSelectUsers} showActions={false} />
    </div>
  );
};

export default AssignUsersPage;