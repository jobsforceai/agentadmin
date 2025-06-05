import { create } from 'zustand';
import { 
  createAgent, 
  getAllAgents, 
  getAgentDetails, 
  updateAgentType 
} from '../lib/api';
import { Agent, AgentsList } from '../lib/types';

interface AgentsState {
  agents: Agent[];
  totalAgents: number;
  currentPage: number;
  totalPages: number;
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
  fetchAgents: (params?: {
    search?: string;
    role?: 'selfapply' | 'userapply';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  createNewAgent: (data: {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: 'selfapply' | 'userapply';
  }) => Promise<boolean>;
  updateAgentRole: (data: {
    agentId: string;
    type: 'selfapply' | 'userapply';
  }) => Promise<boolean>;
  getAgentById: (agentId: string) => Promise<void>;
  clearSelectedAgent: () => void;
}

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: [],
  totalAgents: 0,
  currentPage: 1,
  totalPages: 1,
  selectedAgent: null,
  isLoading: false,
  error: null,

  fetchAgents: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: AgentsList = await getAllAgents(params);
      set({
        agents: response.data,
        totalAgents: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch agents.';
      set({ isLoading: false, error: errorMessage });
    }
  },

  createNewAgent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await createAgent(data);
      // Refresh the agent list after creation
      await get().fetchAgents();
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create agent.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  updateAgentRole: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateAgentType(data);
      // Refresh the agent list after update
      await get().fetchAgents();
      
      // Update selected agent if it's the one being updated
      const selectedAgent = get().selectedAgent;
      if (selectedAgent && selectedAgent._id === data.agentId) {
        await get().getAgentById(data.agentId);
      }
      
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update agent role.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  getAgentById: async (agentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAgentDetails({ agentId });
      set({
        selectedAgent: response.agent,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch agent details.';
      set({ isLoading: false, error: errorMessage });
    }
  },

  clearSelectedAgent: () => {
    set({ selectedAgent: null });
  }
}));