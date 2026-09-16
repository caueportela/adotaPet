import { useEffect, useState } from 'react';
import { AcessoInicial } from './components/AcessoInicial';
import { ClienteHome } from './components/ClienteHome';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import type { AuthUser } from './types/auth';

type Tela = 'inicio' | 'cliente' | 'loginFuncionario' | 'loginAdmin';

const caminhos: Record<Tela, string> = {
  inicio: '/home',
  cliente: '/cliente',
  loginFuncionario: '/login/funcionario',
  loginAdmin: '/login/admin',
};

const telaPeloCaminho = (pathname: string): Tela => {
  if (pathname === caminhos.cliente) {
    return 'cliente';
  }

  if (pathname === caminhos.loginFuncionario) {
    return 'loginFuncionario';
  }

  if (pathname === caminhos.loginAdmin) {
    return 'loginAdmin';
  }

  return 'inicio';
};

export function App() {
  const [tela, setTela] = useState<Tela>(() => telaPeloCaminho(window.location.pathname));
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const telaInicial = telaPeloCaminho(window.location.pathname);
    window.history.replaceState({ tela: telaInicial }, '', caminhos[telaInicial]);

    const handlePopState = () => {
      setToken(null);
      setUser(null);
      setTela(telaPeloCaminho(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navegarPara = (novaTela: Tela) => {
    setTela(novaTela);
    window.history.pushState({ tela: novaTela }, '', caminhos[novaTela]);
  };

  const handleLoginSuccess = (newToken: string, loggedUser: AuthUser) => {
    setToken(newToken);
    setUser(loggedUser);
    window.history.pushState({ tela: 'painel' }, '', '/painel');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navegarPara('inicio');
  };

  if (token && user) {
    return <Dashboard token={token} user={user} onLogout={handleLogout} />;
  }

  if (tela === 'cliente') {
    return <ClienteHome onBackHome={() => navegarPara('inicio')} />;
  }

  if (tela === 'loginFuncionario') {
    return (
      <Login
        tipo="funcionario"
        onBack={() => navegarPara('inicio')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (tela === 'loginAdmin') {
    return (
      <Login tipo="admin" onBack={() => navegarPara('inicio')} onLoginSuccess={handleLoginSuccess} />
    );
  }

  return (
    <AcessoInicial
      onCliente={() => navegarPara('cliente')}
      onFuncionario={() => navegarPara('loginFuncionario')}
      onAdmin={() => navegarPara('loginAdmin')}
    />
  );
}

export default App;
