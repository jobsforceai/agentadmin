import React from 'react';
import { useParams, Link } from 'react-router-dom';
import UserMeetings from '../../components/users/UserMeetings';
import Button from '../../components/ui/Button';
import { ArrowLeft, Briefcase } from 'lucide-react';

const UserMeetingsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  
  if (!userId) {
    return <div>User ID is required</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Meetings</h1>
          <p className="text-gray-500">View and manage user's scheduled meetings</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/users">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <Link to={`/users/${userId}/jobs`}>
            <Button>
              <Briefcase className="h-4 w-4 mr-2" />
              View Jobs
            </Button>
          </Link>
        </div>
      </div>
      
      <UserMeetings userId={userId} />
    </div>
  );
};

export default UserMeetingsPage;