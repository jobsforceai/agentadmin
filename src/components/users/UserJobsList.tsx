import React, { useEffect, useState } from 'react';
import { useUsersStore } from '../../store/users';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface UserJobsListProps {
  userId: string;
}

const UserJobsList = ({ userId }: UserJobsListProps) => {
  const { getUserJobs, userJobs, isLoading } = useUsersStore();
  const [activeTab, setActiveTab] = useState<'applied' | 'received'>('applied');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (userId) {
      getUserJobs({ userId, status: activeTab, page: currentPage });
    }
  }, [userId, activeTab, currentPage, getUserJobs]);

  const handleTabChange = (tab: 'applied' | 'received') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && !userJobs) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs History</CardTitle>
      </CardHeader>
      <CardContent>
        {userJobs ? (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold mt-1">{userJobs.stats.totalWishlist}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Applied</p>
                <p className="text-2xl font-bold mt-1">{userJobs.stats.applied}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Received</p>
                <p className="text-2xl font-bold mt-1">{userJobs.stats.received}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Applied %</p>
                <p className="text-2xl font-bold mt-1">{userJobs.stats.appliedPct}</p>
              </div>
            </div>
            
            <div className="flex space-x-2 border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'applied'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('applied')}
              >
                Applied Jobs
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'received'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('received')}
              >
                Received Jobs
              </button>
            </div>
            
            {userJobs.jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                      </th>
                      {activeTab === 'applied' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proof
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userJobs.jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">{job.joburl}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            job.priority === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : job.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {format(new Date(job.createdAt), 'MMM d, yyyy')}
                        </td>
                        {activeTab === 'applied' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {job.proofofapply ? (
                              <a
                                href={job.proofofapply}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Proof
                              </a>
                            ) : (
                              <span className="text-gray-500">No proof</span>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href={job.joburl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No {activeTab} jobs found.</p>
              </div>
            )}
            
            {/* Pagination */}
            {userJobs.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(userJobs.page - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(userJobs.page * 10, userJobs.totalThisStatus)}</span> of{' '}
                  <span className="font-medium">{userJobs.totalThisStatus}</span> jobs
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={userJobs.page === 1}
                    onClick={() => handlePageChange(userJobs.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={userJobs.page === userJobs.totalPages}
                    onClick={() => handlePageChange(userJobs.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No job data available for this user.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserJobsList;