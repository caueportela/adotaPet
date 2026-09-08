import { useState } from 'react';
import { Login } from './components/Login';

export function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ padding: '32px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1>🐾 AdotaPet - Painel Administrativo</h1>
      <p>Bem-vindo ao sistema de gestão de pets!</p>
      <button 
        onClick={handleLogout}
        style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px' }}
      >
        Sair
      </button>
    </div>
  );
}

export default App;