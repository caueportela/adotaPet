import { useEffect, useState } from 'react';
import { AcessoInicial } from './components/AcessoInicial';
import { ClienteHome } from './components/ClienteHome';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import type { AuthUser } from './types/auth';

type Tela = 'inicio' | 'cliente' | 'loginFuncionario' | 'loginAdmin' | 'painel';

const TOKEN_STORAGE_KEY = 'adotapet:token';
const USER_STORAGE_KEY = 'adotapet:user';

const caminhos: Record<Tela, string> = {
  inicio: '/home',
  cliente: '/cliente',
  loginFuncionario: '/login/funcionario',
  loginAdmin: '/login/admin',
  painel: '/painel',
};

const telaPeloCaminho = (pathname: string): Tela => {
  if (pathname === caminhos.painel) {
    return 'painel';
  }

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

const carregarUsuarioSalvo = (): AuthUser | null => {
  const userSalvo = localStorage.getItem(USER_STORAGE_KEY);

  if (!userSalvo) {
    return null;
  }

  try {
    return JSON.parse(userSalvo) as AuthUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export function App() {
  const [tela, setTela] = useState<Tela>(() => telaPeloCaminho(window.location.pathname));
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(() => carregarUsuarioSalvo());

  useEffect(() => {
    const rotaInicial = telaPeloCaminho(window.location.pathname);
    const temSessaoSalva =
      Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)) && Boolean(carregarUsuarioSalvo());
    const telaInicial = rotaInicial === 'painel' && !temSessaoSalva ? 'inicio' : rotaInicial;

    window.history.replaceState({ tela: telaInicial }, '', caminhos[telaInicial]);

    const handlePopState = () => {
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
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setToken(newToken);
    setUser(loggedUser);
    setTela('painel');
    window.history.pushState({ tela: 'painel' }, '', caminhos.painel);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
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
