import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" />
      <button type="submit" className="btn-primary w-full">Sign in</button>
    </form>
  );
};

export default LoginForm;
