
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLoginRequest } from '../../../shared/api/auth/auth-api';

const Login = () => {
  // States.
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>();

  // Router.
  const navigate = useNavigate();

  // Hooks.
  const {
    mutate: sendLoginRequest,
    isPending: isLoadingLoginRequest,
    data: loginRequestResponse,
    isSuccess: isSuccessLoginRequest,
    isError: isErrorLoginRequest,
    error: loginErrorResponse,
  } = useLoginRequest();

  // useEffects.
  useEffect(() => {
    if (isSuccessLoginRequest && loginRequestResponse) {
      navigate('/product');
    }
    if (isErrorLoginRequest && loginErrorResponse) {
      toast.error(loginErrorResponse.meta?.message);
    }
  }, [isSuccessLoginRequest, isErrorLoginRequest])


  //Handlers.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    sendLoginRequest({
      username,
      password
    });

  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Fuel Tracker Tool</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>


            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={isLoadingLoginRequest}>
              Log In
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-600">
                New User? Create an account{' '}
                <a href="/register" className="text-blue-600 hover:underline">
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;