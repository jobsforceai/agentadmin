import React, { useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Briefcase, Calendar, UserCheck } from 'lucide-react';
import { useAgentsStore } from '../store/agents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { fetchAgents, agents, totalAgents } = useAgentsStore();
  
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Agents" 
          value={totalAgents} 
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard 
          title="Self Apply Agents" 
          value={agents.filter(a => a.role === 'selfapply').length} 
          icon={<UserCheck className="h-5 w-5 text-purple-600" />}
        />
        <StatsCard 
          title="User Apply Agents" 
          value={agents.filter(a => a.role === 'userapply').length} 
          icon={<Briefcase className="h-5 w-5 text-green-600" />}
        />
        <StatsCard 
          title="Total Assigned Users" 
          value={agents.reduce((sum, agent) => sum + (agent.assignedUsers?.length || 0), 0)} 
          icon={<Calendar className="h-5 w-5 text-orange-600" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {agents.map((agent) => (
                <div key={agent._id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                    {agent.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{agent.username}</p>
                        <p className="text-sm text-gray-500">{agent.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {agent.assignedUsers?.length || 0} users
                        </p>
                        <p className="text-sm text-gray-500">
                          {agent.role === 'selfapply' ? 'Self Apply' : 'User Apply'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(agent.assignedUsers?.length || 0) / Math.max(...agents.map(a => a.assignedUsers?.length || 0)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {agents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No agents data available.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agents.map(agent => ({
                    name: agent.username,
                    users: agent.assignedUsers?.length || 0
                  }))}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} users`, 'Assigned']}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
                  />
                  <Bar dataKey="users" fill="#3fe3ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;