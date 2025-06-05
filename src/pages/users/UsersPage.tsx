import React from 'react';
import UserSearch from '../../components/users/UserSearch';

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
      <UserSearch />
    </div>
  );
};

export default UsersPage;