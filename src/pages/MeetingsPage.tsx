import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar, Search, Check, X, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useUsersStore } from '../store/users';

const MeetingsPage = () => {
  const { getUserMeetings, userMeetings, isLoading } = useUsersStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const handleSearch = () => {
    if (searchQuery) {
      const isEmail = searchQuery.includes('@');
      getUserMeetings({ 
        ...(isEmail ? { email: searchQuery } : { userId: searchQuery }),
        status: selectedStatus !== 'all' ? selectedStatus as 'scheduled' | 'attended' | 'cancelled' : undefined
      });
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'attended':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Meeting Schedule</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by user ID or email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3fe3ff] focus:border-[#3fe3ff]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <select
                className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3fe3ff] focus:border-[#3fe3ff]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <Button onClick={handleSearch} isLoading={isLoading}>
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Meeting List</CardTitle>
        </CardHeader>
        <CardContent>
          {userMeetings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timezone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userMeetings.map((meeting) => (
                    <tr key={meeting._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{format(parseISO(meeting.date), 'MMM d, yyyy')}</div>
                        <div className="text-sm text-gray-500">{meeting.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {meeting.timezone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {meeting.durationMinutes} minutes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(meeting.status)}
                          <span className={`ml-2 ${
                            meeting.status === 'scheduled' ? 'text-yellow-700' :
                            meeting.status === 'attended' ? 'text-green-700' :
                            'text-red-700'
                          }`}>
                            {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={meeting.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-500">
                {searchQuery ? 'No meetings found for the selected filters.' : 'Enter a user ID or email to view meetings.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingsPage;