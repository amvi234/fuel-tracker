import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRegisterRequest } from '../../../shared/api/auth/auth-api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // States
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Router
  const navigate = useNavigate();

  // Hooks
  const {
    mutate: sendRegisterRequest,
    isPending: isLoadingRegisterRequest,
    data: registerRequestResponse,
    isSuccess: isSuccessRegisterRequest,
    isError: isErrorRegisterRequest,
    error: registerErrorResponse,
  } = useRegisterRequest();

  // useEffects
  useEffect(() => {
    if (isSuccessRegisterRequest && registerRequestResponse) {
      setRegistrationComplete(true);
      toast.success(registerRequestResponse.meta?.message || 'Registration completed. Please check your email to verify your account.');
    }
    if (isErrorRegisterRequest && registerErrorResponse) {
      const errorMessage = registerErrorResponse?.data?.meta?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [isSuccessRegisterRequest, isErrorRegisterRequest, registerRequestResponse, registerErrorResponse]);

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 6 characters long');
      return;
    }
    sendRegisterRequest({
      username: username.trim(),
      email: email.trim(),
      password
    });
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    setRegistrationComplete(false);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Show success message after registration
  if (registrationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M15 24l6 6 12-12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full py-2 cursor-pointer px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Go to Login
              </button>
              <button
                onClick={handleTryAgain}
                className="w-full py-2 cursor-pointer px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Register Another Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Fuel Tracker Tool</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoadingRegisterRequest}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoadingRegisterRequest}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoadingRegisterRequest}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoadingRegisterRequest}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:opacity-75 disabled:cursor-not-allowed font-medium"
            disabled={isLoadingRegisterRequest}
          >
            {isLoadingRegisterRequest ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={handleGoToLogin}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Log in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;