import { create } from 'zustand';
import { 
  assignUsersToAgent, 
  authorizeUser, 
  deauthorizeUser, 
  getJobsApplied, 
  getMeetEvents, 
  searchUsers 
} from '../lib/api';
import { JobsResponse, Meeting, MeetingResponse, User, UserSearch } from '../lib/types';

interface UsersState {
  users: User[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  selectedUser: User | null;
  userJobs: JobsResponse | null;
  userMeetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  searchAvailableUsers: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  assignUsers: (data: {
    agentId: string;
    userIds: string[];
  }) => Promise<boolean>;
  toggleUserAuthorization: (userId: string, authorize: boolean) => Promise<boolean>;
  getUserJobs: (params: {
    userId: string;
    status?: 'applied' | 'received';
    page?: number;
    limit?: number;
  }) => Promise<void>;
  getUserMeetings: (params: {
    userId?: string;
    email?: string;
    status?: 'scheduled' | 'attended' | 'cancelled';
  }) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
  selectedUser: null,
  userJobs: null,
  userMeetings: [],
  isLoading: false,
  error: null,

  searchAvailableUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: UserSearch = await searchUsers(params);
      set({
        users: response.data,
        totalUsers: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to search users.';
      set({ isLoading: false, error: errorMessage });
    }
  },

  assignUsers: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await assignUsersToAgent(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to assign users to agent.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  toggleUserAuthorization: async (userId, authorize) => {
    set({ isLoading: true, error: null });
    try {
      if (authorize) {
        await authorizeUser({ userId });
      } else {
        await deauthorizeUser({ userId });
      }
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to ${authorize ? 'authorize' : 'deauthorize'} user.`;
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  getUserJobs: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response: JobsResponse = await getJobsApplied(params);
      set({
        userJobs: response,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch user jobs.';
      set({ isLoading: false, error: errorMessage });
    }
  },

  getUserMeetings: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response: MeetingResponse = await getMeetEvents(params);
      set({
        userMeetings: response.events,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch user meetings.';
      set({ isLoading: false, error: errorMessage });
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  }
}));