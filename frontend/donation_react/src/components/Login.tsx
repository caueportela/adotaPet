import React, { useState } from 'react';
import type { LoginCredentials } from '../types/auth';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    senha: '',
  });

  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!formData.email || !formData.senha) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      setErro(data.message || 'Credenciais inválidas');
      return;
    }

    onLoginSuccess(data.access_token);
    } catch {
      setErro('Erro ao se conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>🐾 AdotaPet</h1>
          <p style={styles.subheading}>Painel do Funcionário</p>
        </div>

        {erro && <div style={styles.errorBanner}>{erro}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail Institucional</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="funcionario@adotapet.com"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <div style={styles.passwordWrapper}>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={styles.toggleBtn}
              >
                {mostrarSenha ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={carregando} style={styles.button}>
            {carregando ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};


const styles: { [key: string]: React.CSSProperties } = {
  container: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  // Fundo com gradiente suave + padrão de patinhas em SVG puro
  backgroundColor: '#edf7ed',
  backgroundImage: `
    radial-gradient(at 0% 0%, rgba(46, 125, 50, 0.12) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(129, 199, 132, 0.2) 0px, transparent 50%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cg fill='%232e7d32' fill-opacity='0.07'%3E%3Ccircle cx='30' cy='35' r='6'/%3E%3Ccircle cx='50' cy='28' r='6'/%3E%3Ccircle cx='70' cy='35' r='6'/%3E%3Cpath d='M50 45 c-12 0 -20 8 -20 18 c0 10 8 16 20 16 c12 0 20 -6 20 -16 c0 -10 -8 -18 -20 -18 z'/%3E%3C/g%3E%3C/svg%3E")
  `,
  fontFamily: 'Segoe UI, sans-serif',
},
  card: {
    width: '100%',
    maxWidth: '380px',
    padding: '32px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logo: {
    margin: 0,
    color: '#2e7d32',
    fontSize: '28px',
  },
  subheading: {
    margin: '4px 0 0',
    color: '#666',
    fontSize: '14px',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px 12px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '13px',
    border: '1px solid #ffcdd2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#333',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  toggleBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#2e7d32',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  button: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};