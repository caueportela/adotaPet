import React, { useState } from 'react';
import type { AuthUser, UserRole } from '../types/auth';

type UsuarioForm = {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
};

interface CadastroUsuarioProps {
  token: string;
  user: AuthUser;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const initialForm: UsuarioForm = {
  nome: '',
  email: '',
  senha: '',
  role: 'FUNCIONARIO',
};

export const CadastroUsuario: React.FC<CadastroUsuarioProps> = ({ token, user }) => {
  const [form, setForm] = useState<UsuarioForm>(initialForm);
  const [cadastrados, setCadastrados] = useState<AuthUser[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const limpar = () => {
    setForm(initialForm);
    setErro(null);
    setSucesso(null);
  };

  const salvarUsuario = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!form.nome || !form.email || !form.senha) {
      setErro('Preencha nome, e-mail e senha inicial.');
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível cadastrar o usuário.');
      }

      setCadastrados((atuais) => [data, ...atuais]);
      setSucesso(`Usuário cadastrado: ${data.nome}`);
      setForm(initialForm);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao cadastrar usuário.');
    } finally {
      setSalvando(false);
    }
  };

  if (user.role !== 'ADMIN') {
    return (
      <section style={styles.blockedCard}>
        <h2 style={styles.title}>Funcionários</h2>
        <p style={styles.subtitle}>
          Apenas administradores podem cadastrar novos funcionários no sistema.
        </p>
      </section>
    );
  }

  return (
    <section style={styles.wrapper}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Cadastro de funcionário</h2>
        <p style={styles.subtitle}>Crie acessos para funcionários ou administradores.</p>

        {erro && <div style={styles.error}>{erro}</div>}
        {sucesso && <div style={styles.success}>{sucesso}</div>}

        <form onSubmit={salvarUsuario} style={styles.form}>
          <label style={styles.fullField}>
            Nome completo
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Ana Souza"
              style={styles.input}
            />
          </label>

          <label style={styles.fullField}>
            E-mail institucional
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ana@adotapet.com"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            Perfil
            <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
              <option value="FUNCIONARIO">Funcionário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <label style={styles.field}>
            Senha inicial
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              placeholder="mínimo 6 caracteres"
              style={styles.input}
            />
          </label>

          <div style={styles.actions}>
            <button type="button" onClick={limpar} style={styles.clearButton}>
              Limpar
            </button>

            <button type="submit" disabled={salvando} style={styles.saveButton}>
              {salvando ? 'Salvando...' : 'Salvar cadastro'}
            </button>
          </div>
        </form>
      </div>

      <aside style={styles.listCard}>
        <h2 style={styles.title}>Cadastrados agora</h2>

        {cadastrados.length === 0 ? (
          <p style={styles.emptyText}>Os usuários criados nesta sessão aparecem aqui.</p>
        ) : (
          <div style={styles.userList}>
            {cadastrados.map((usuario) => (
              <div key={usuario.id} style={styles.userItem}>
                <strong>{usuario.nome}</strong>
                <span>{usuario.email}</span>
                <small>{usuario.role}</small>
              </div>
            ))}
          </div>
        )}
      </aside>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '28px',
  },
  formCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '4px 6px 0 #111',
  },
  listCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '4px 6px 0 #111',
  },
  blockedCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '4px 6px 0 #111',
  },
  title: {
    margin: 0,
    color: '#1f2933',
    fontSize: '22px',
  },
  subtitle: {
    margin: '6px 0 20px',
    color: '#667085',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontWeight: 600,
  },
  fullField: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontWeight: 600,
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #aab2bd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  actions: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  clearButton: {
    padding: '10px 36px',
    border: '1px solid #c8d0d8',
    borderRadius: '6px',
    background: '#f5f7f6',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 36px',
    border: 'none',
    borderRadius: '6px',
    background: '#2e7d32',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    margin: '16px 0',
    padding: '10px',
    background: '#ffebee',
    color: '#c62828',
    borderRadius: '6px',
  },
  success: {
    margin: '16px 0',
    padding: '10px',
    background: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '6px',
  },
  emptyText: {
    color: '#667085',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userItem: {
    padding: '14px',
    border: '1px solid #d5dbe2',
    borderRadius: '6px',
    display: 'grid',
    gap: '4px',
  },
};
