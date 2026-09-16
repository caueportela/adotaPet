import React, { useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '../types/auth';

type StatusInteresse = 'PENDENTE' | 'EM_ANALISE' | 'APROVADO' | 'REJEITADO';

type Animal = {
  id: string;
  nome: string;
  especie: 'CACHORRO' | 'GATO';
  raca?: string | null;
};

type Interesse = {
  id: string;
  nomeInteressado: string;
  email: string;
  telefone: string;
  mensagem?: string | null;
  status: StatusInteresse;
  createdAt?: string;
  animal?: Animal;
};

interface DashboardProps {
  token: string;
  user: AuthUser;
  onLogout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const statusLabel: Record<StatusInteresse, string> = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

export const Dashboard: React.FC<DashboardProps> = ({ token, user, onLogout }) => {
  const [interesses, setInteresses] = useState<Interesse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

const carregarInteresses = async () => {
  setCarregando(true);
  setErro(null);

  try {
    const resposta = await fetch(`${API_URL}/interesse`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      throw new Error(data.message || 'Não foi possível carregar os interesses.');
    }

    setInteresses(data);
  } catch (error) {
    setErro(error instanceof Error ? error.message : 'Erro ao carregar interesses.');
  } finally {
    setCarregando(false);
  }
};

useEffect(() => {
  let cancelado = false;

  fetch(`${API_URL}/interesse`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (resposta) => {
      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível carregar os interesses.');
      }

      if (!cancelado) {
        setInteresses(data);
      }
    })
    .catch((error) => {
      if (!cancelado) {
        setErro(error instanceof Error ? error.message : 'Erro ao carregar interesses.');
      }
    })
    .finally(() => {
      if (!cancelado) {
        setCarregando(false);
      }
    });

  return () => {
    cancelado = true;
  };
}, [token]);

  const totais = useMemo(() => {
    return {
      PENDENTE: interesses.filter((item) => item.status === 'PENDENTE').length,
      EM_ANALISE: interesses.filter((item) => item.status === 'EM_ANALISE').length,
      APROVADO: interesses.filter((item) => item.status === 'APROVADO').length,
      REJEITADO: interesses.filter((item) => item.status === 'REJEITADO').length,
    };
  }, [interesses]);

  const atualizarStatus = async (id: string, status: StatusInteresse) => {
    setAtualizandoId(id);
    setErro(null);

    try {
      const resposta = await fetch(`${API_URL}/interesse/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível atualizar o status.');
      }

      setInteresses((atual) =>
        atual.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar status.');
    } finally {
      setAtualizandoId(null);
    }
  };
 return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>🐾 AdotaPet</h1>
          <p style={styles.subtitle}>Painel do Funcionário</p>
        </div>

        <div style={styles.userArea}>
          <strong>{user.nome}</strong>
          <span style={styles.userRole}>{user.role}</span>
          <button onClick={onLogout} style={styles.logoutButton}>Sair</button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.statsGrid}>
          {Object.entries(totais).map(([status, total]) => (
            <div key={status} style={styles.statCard}>
              <strong style={styles.statNumber}>{total}</strong>
              <span>{statusLabel[status as StatusInteresse]}</span>
            </div>
          ))}
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Interesses de adoção</h2>
              <p style={styles.cardSubtitle}>Acompanhe e atualize as solicitações recebidas.</p>
            </div>

            <button onClick={carregarInteresses} style={styles.secondaryButton}>
              Atualizar
            </button>
          </div>

          {erro && <div style={styles.errorBanner}>{erro}</div>}

          {carregando ? (
            <p>Carregando interesses...</p>
          ) : interesses.length === 0 ? (
            <p>Nenhum interesse cadastrado ainda.</p>
          ) : (
            <div style={styles.list}>
              {interesses.map((interesse) => (
                <article key={interesse.id} style={styles.item}>
                  <div>
                    <strong>{interesse.nomeInteressado}</strong>
                    <p style={styles.meta}>
                      {interesse.email} • {interesse.telefone}
                    </p>
                    <p style={styles.meta}>
                      Animal: {interesse.animal?.nome ?? 'Não informado'}
                    </p>
                    {interesse.mensagem && <p style={styles.message}>{interesse.mensagem}</p>}
                  </div>

                  <select
                    value={interesse.status}
                    disabled={atualizandoId === interesse.id}
                    onChange={(event) =>
                      atualizarStatus(interesse.id, event.target.value as StatusInteresse)
                    }
                    style={styles.select}
                  >
                    <option value="PENDENTE">Pendente</option>
                    <option value="EM_ANALISE">Em análise</option>
                    <option value="APROVADO">Aprovado</option>
                    <option value="REJEITADO">Rejeitado</option>
                  </select>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#edf7ed',
    backgroundImage: `
      radial-gradient(at 0% 0%, rgba(46, 125, 50, 0.12) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(129, 199, 132, 0.2) 0px, transparent 50%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cg fill='%232e7d32' fill-opacity='0.07'%3E%3Ccircle cx='30' cy='35' r='6'/%3E%3Ccircle cx='50' cy='28' r='6'/%3E%3Ccircle cx='70' cy='35' r='6'/%3E%3Cpath d='M50 45 c-12 0 -20 8 -20 18 c0 10 8 16 20 16 c12 0 20 -6 20 -16 c0 -10 -8 -18 -20 -18 z'/%3E%3C/g%3E%3C/svg%3E")
                     `,
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    padding: '24px 32px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    color: '#2e7d32',
    fontSize: '28px',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#666',
    fontSize: '14px',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userRole: {
    color: '#666',
    fontSize: '13px',
  },
  logoutButton: {
    padding: '8px 14px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  main: {
    padding: '32px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  statNumber: {
    display: 'block',
    color: '#2e7d32',
    fontSize: '28px',
    marginBottom: '4px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    margin: 0,
    color: '#2e7d32',
    fontSize: '22px',
  },
  cardSubtitle: {
    margin: '4px 0 0',
    color: '#666',
    fontSize: '14px',
  },
  secondaryButton: {
    padding: '9px 14px',
    backgroundColor: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px 12px',
    borderRadius: '6px',
    marginBottom: '16px',
    border: '1px solid #ffcdd2',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
  },
  meta: {
    margin: '4px 0 0',
    color: '#666',
    fontSize: '13px',
  },
  message: {
    margin: '10px 0 0',
    color: '#333',
    fontSize: '14px',
  },
  select: {
    padding: '9px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
};