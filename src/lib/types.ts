// User types
export interface User {
  _id: string;
  userName: string;
  email: string;
  loginMethod: 'email' | 'google';
  hasSubmittedQueryForm: boolean;
  isVerified: boolean;
  isDetailsFilled: boolean;
  userType: 'freemium' | 'premium';
  isBlocked: boolean;
  portfoliourl: string[];
  authforextension: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSearch {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

// Agent types
export interface Agent {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: 'selfapply' | 'userapply';
  assignedUsers: User[];
  createdAt: string;
  updatedAt: string;
}

export interface AgentsList {
  message: string;
  data: Agent[];
  total: number;
  page: number;
  totalPages: number;
}

// Job types
export interface Job {
  _id: string;
  userId: string;
  joburl: string;
  status: 'received' | 'applied';
  priority: 'low' | 'medium' | 'high';
  proofofapply: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  totalWishlist: number;
  applied: number;
  received: number;
  appliedPct: string;
}

export interface JobsResponse {
  message: string;
  agent: Agent;
  stats: JobStats;
  statusRequested: string;
  page: number;
  totalPages: number;
  totalThisStatus: number;
  jobs: Job[];
}

// Meeting types
export interface Meeting {
  _id: string;
  userId: string;
  date: string;
  time: string;
  timezone: string;
  status: 'scheduled' | 'attended' | 'cancelled';
  meetLink: string;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingResponse {
  message: string;
  count: number;
  events: Meeting[];
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    email: string;
  };
}

export interface AgentCreatePayload {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: 'selfapply' | 'userapply';
}

export interface AgentUpdatePayload {
  agentId: string;
  type: 'selfapply' | 'userapply';
}

export interface UserAssignPayload {
  agentId: string;
  userIds: string[];
}

export interface UserAuthPayload {
  userId: string;
}

export interface AgentDetailsPayload {
  agentId: string;
}