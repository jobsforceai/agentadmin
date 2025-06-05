import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAgentsStore } from '../../store/agents';
import { toast } from 'react-toastify';

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'selfapply' | 'userapply';
}

const AgentForm = ({ onSuccess, onCancel }: AgentFormProps) => {
  const { createNewAgent, isLoading } = useAgentsStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      role: 'userapply'
    }
  });

  const onSubmit = async (data: FormValues) => {
    const result = await createNewAgent(data);
    if (result) {
      toast.success('Agent created successfully');
      if (onSuccess) {
        onSuccess();
      }
    } else {
      toast.error('Failed to create agent');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Username"
          placeholder="johndoe"
          fullWidth
          {...register('username', { 
            required: 'Username is required' 
          })}
          error={errors.username?.message}
        />
        
        <Input
          type="email"
          label="Email"
          placeholder="john.doe@example.com"
          fullWidth
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors.email?.message}
        />
        
        <Input
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          fullWidth
          {...register('phoneNumber', { 
            required: 'Phone number is required' 
          })}
          error={errors.phoneNumber?.message}
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          fullWidth
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
          error={errors.password?.message}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('role')}
          >
            <option value="userapply">User Apply</option>
            <option value="selfapply">Self Apply</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          isLoading={isLoading}
        >
          Create Agent
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;