import React, { useEffect, useState } from 'react';
import { useAgentsStore } from '../../store/agents';
import { useUsersStore } from '../../store/users';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { UserPlus, Calendar, Briefcase } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { selectedAgent, getAgentById, updateAgentRole, isLoading } = useAgentsStore();
  const [roleUpdating, setRoleUpdating] = useState(false);

  useEffect(() => {
    if (agentId) {
      getAgentById(agentId);
    }
  }, [agentId, getAgentById]);

  const handleToggleRole = async () => {
    if (!selectedAgent) return;
    
    setRoleUpdating(true);
    const newRole = selectedAgent.role === 'selfapply' ? 'userapply' : 'selfapply';
    
    const success = await updateAgentRole({
      agentId: selectedAgent._id,
      type: newRole
    });
    
    if (success) {
      toast.success(`Agent role updated to ${newRole === 'selfapply' ? 'Self Apply' : 'User Apply'}`);
    } else {
      toast.error('Failed to update agent role');
    }
    setRoleUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (!selectedAgent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Agent not found</h3>
        <p className="text-gray-500 mb-6">The agent you're looking for doesn't exist or has been removed.</p>
        <Link to="/agents">
          <Button>Go back to agents list</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Agent Details</h1>
        <div className="flex space-x-3">
          <Link to={`/agents/${agentId}/assign-users`}>
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Users
            </Button>
          </Link>
          <Button 
            onClick={handleToggleRole}
            isLoading={roleUpdating}
          >
            Switch to {selectedAgent.role === 'selfapply' ? 'User Apply' : 'Self Apply'}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Agent Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
              <p className="text-gray-900">{selectedAgent.username}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p className="text-gray-900">{selectedAgent.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
              <p className="text-gray-900">{selectedAgent.phoneNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Role</h4>
              <p className="text-gray-900">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedAgent.role === 'selfapply' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedAgent.role === 'selfapply' ? 'Self Apply' : 'User Apply'}
                </span>
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Created At</h4>
              <p className="text-gray-900">{format(new Date(selectedAgent.createdAt), 'PPP')}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
              <p className="text-gray-900">{format(new Date(selectedAgent.updatedAt), 'PPP')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assigned Users ({selectedAgent.assignedUsers?.length || 0})</CardTitle>
          <Link to={`/agents/${agentId}/assign-users`}>
            <Button size="sm">Manage Users</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {selectedAgent.assignedUsers && selectedAgent.assignedUsers.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {selectedAgent.assignedUsers.map((user) => (
                <div key={user._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{user.userName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/users/${user._id}/jobs`}>
                      <Button size="sm" variant="outline">
                        <Briefcase className="h-4 w-4 mr-1" />
                        Jobs
                      </Button>
                    </Link>
                    <Link to={`/users/${user._id}/meetings`}>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Meetings
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No users are assigned to this agent yet.</p>
              <Link to={`/agents/${agentId}/assign-users`} className="mt-4 inline-block">
                <Button>Assign Users</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDetails;