import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import type { AuthUser } from './types/auth';

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleLoginSuccess = (newToken: string, loggedUser: AuthUser) => {
    setToken(newToken);
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard token={token} user={user} onLogout={handleLogout} />;
}

export default App;