import React, { useEffect, useState } from 'react';
import { useUsersStore } from '../../store/users';
import { Search, UserCheck, UserX } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { toast } from 'react-toastify';

interface UserSearchProps {
  onSelectUsers?: (userIds: string[]) => void;
  showActions?: boolean;
}

const UserSearch = ({ onSelectUsers, showActions = true }: UserSearchProps) => {
  const { users, totalUsers, currentPage, totalPages, searchAvailableUsers, toggleUserAuthorization, isLoading } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    searchAvailableUsers();
  }, [searchAvailableUsers]);

  const handleSearch = () => {
    searchAvailableUsers({
      search: searchTerm || undefined,
    });
  };

  const handlePageChange = (page: number) => {
    searchAvailableUsers({
      search: searchTerm || undefined,
      page
    });
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const handleApplySelection = () => {
    if (onSelectUsers) {
      onSelectUsers(selectedUsers);
    }
  };

  const handleToggleAuthorization = async (userId: string, currentAuth: string) => {
    const shouldAuthorize = currentAuth !== 'true';
    const success = await toggleUserAuthorization(userId, shouldAuthorize);
    
    if (success) {
      toast.success(`User ${shouldAuthorize ? 'authorized' : 'deauthorized'} successfully`);
      searchAvailableUsers({
        search: searchTerm || undefined,
        page: currentPage
      });
    } else {
      toast.error(`Failed to ${shouldAuthorize ? 'authorize' : 'deauthorize'} user`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by username or email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div>
              <Button onClick={handleSearch} isLoading={isLoading}>
                Search
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {onSelectUsers && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {showActions && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      {onSelectUsers && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleUserSelect(user._id)}
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.authforextension === 'true' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.authforextension === 'true' ? 'Authorized' : 'Unauthorized'}
                        </span>
                      </td>
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            size="sm"
                            variant={user.authforextension === 'true' ? 'danger' : 'primary'}
                            onClick={() => handleToggleAuthorization(user._id, user.authforextension)}
                          >
                            {user.authforextension === 'true' ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Deauthorize
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Authorize
                              </>
                            )}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={onSelectUsers ? 5 : 4} className="px-6 py-4 text-center text-gray-500">
                      {isLoading ? 'Loading users...' : 'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 10, totalUsers)}</span> of{' '}
                <span className="font-medium">{totalUsers}</span> users
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {onSelectUsers && selectedUsers.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{selectedUsers.length}</span> users selected
              </div>
              <Button onClick={handleApplySelection}>
                Apply Selection
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSearch;