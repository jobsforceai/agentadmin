import React, { useEffect, useState } from 'react';
import { useUsersStore } from '../../store/users';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { format, parseISO } from 'date-fns';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';

interface UserMeetingsProps {
  userId: string;
}

const UserMeetings = ({ userId }: UserMeetingsProps) => {
  const { getUserMeetings, userMeetings, isLoading } = useUsersStore();
  const [activeTab, setActiveTab] = useState<'scheduled' | 'attended' | 'cancelled' | 'all'>('all');

  useEffect(() => {
    if (userId) {
      getUserMeetings({ 
        userId,
        status: activeTab !== 'all' ? activeTab : undefined
      });
    }
  }, [userId, activeTab, getUserMeetings]);

  const handleTabChange = (tab: 'scheduled' | 'attended' | 'cancelled' | 'all') => {
    setActiveTab(tab);
  };

  const filteredMeetings = activeTab === 'all' 
    ? userMeetings 
    : userMeetings.filter(meeting => meeting.status === activeTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'attended':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (isLoading && userMeetings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('all')}
            >
              All Meetings
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'scheduled'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('scheduled')}
            >
              Scheduled
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'attended'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('attended')}
            >
              Attended
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'cancelled'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('cancelled')}
            >
              Cancelled
            </button>
          </div>
          
          {filteredMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeetings.map((meeting) => (
                <div 
                  key={meeting._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium">
                        {format(parseISO(meeting.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(meeting.status)}
                      <span className={`ml-1 text-sm font-medium ${
                        meeting.status === 'scheduled' ? 'text-yellow-700' :
                        meeting.status === 'attended' ? 'text-green-700' :
                        'text-red-700'
                      }`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Time:</span>
                      <span className="text-sm font-medium">{meeting.time} ({meeting.timezone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Duration:</span>
                      <span className="text-sm font-medium">{meeting.durationMinutes} minutes</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <a 
                      href={meeting.meetLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button fullWidth variant="outline">
                        Join Meeting Link
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No {activeTab === 'all' ? '' : activeTab} meetings found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserMeetings;