import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../store/auth';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img 
            src="https://jobsforce.ai/logo-blacktext.png" 
            alt="JobsForce Logo" 
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-600">Sign in to your admin account</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          {(loginError || error) && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {loginError || error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="your.email@example.com"
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
                label="Password"
                type="password"
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
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;