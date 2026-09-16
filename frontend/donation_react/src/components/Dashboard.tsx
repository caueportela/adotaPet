import React, { useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '../types/auth';
import { CadastroAnimal } from './CadastroAnimal';
import { CadastroUsuario } from './CadastroUsuario';

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
  const [telaAtual, setTelaAtual] = useState<
    'solicitacoes' | 'cadastroAnimal' | 'cadastroUsuario'
  >('solicitacoes');

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

  const atualizarStatus = async (interesse: Interesse, status: StatusInteresse) => {
    setAtualizandoId(interesse.id);
    setErro(null);

    try {
      const resposta = await fetch(`${API_URL}/interesse/${interesse.id}/status`, {
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

      if (status === 'APROVADO') {
        if (!interesse.animal?.id) {
          throw new Error('Solicitação aprovada, mas o animal não foi encontrado para marcar como adotado.');
        }

        const respostaAnimal = await fetch(`${API_URL}/animal/${interesse.animal.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'ADOTADO' }),
        });

        const dataAnimal = await respostaAnimal.json();

        if (!respostaAnimal.ok) {
          throw new Error(dataAnimal.message || 'A solicitação foi aprovada, mas o animal não foi marcado como adotado.');
        }
      }

      setInteresses((atual) =>
        atual.map((item) => (item.id === interesse.id ? { ...item, status } : item)),
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
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🐾</span>
          <div>
            <h1 style={styles.logo}>AdotaPet</h1>
            <p style={styles.subtitle}>
              {user.role === 'ADMIN' ? 'Painel Administrativo' : 'Painel do Funcionário'}
            </p>
          </div>
        </div>

        <nav style={styles.topNav}>
          <button onClick={() => setTelaAtual('solicitacoes')} style={styles.navButton}>
            Solicitações
          </button>
          <button onClick={() => setTelaAtual('cadastroAnimal')} style={styles.navButton}>
            Pets
          </button>
          {user.role === 'ADMIN' && (
            <button onClick={() => setTelaAtual('cadastroUsuario')} style={styles.navButton}>
              Funcionários
            </button>
          )}
          <button onClick={onLogout} style={styles.logoutButton}>
            Sair
          </button>
        </nav>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>{user.role === 'ADMIN' ? 'Admin' : 'Funcionário'}</h2>

          <button
            onClick={() => setTelaAtual('solicitacoes')}
            style={telaAtual === 'solicitacoes' ? styles.sideButtonActive : styles.sideButton}
          >
            Solicitações
          </button>

          <button
            onClick={() => setTelaAtual('cadastroAnimal')}
            style={telaAtual === 'cadastroAnimal' ? styles.sideButtonActive : styles.sideButton}
          >
            Cadastrar animal
          </button>

          {user.role === 'ADMIN' && (
            <button
              onClick={() => setTelaAtual('cadastroUsuario')}
              style={telaAtual === 'cadastroUsuario' ? styles.sideButtonActive : styles.sideButton}
            >
              Funcionários
            </button>
          )}

          <div style={styles.userCard}>
            <span style={styles.userLabel}>Logado como:</span>
            <strong>{user.nome}</strong>
            <span style={styles.userRole}>{user.role}</span>
          </div>
        </aside>

        <main style={styles.main}>
          {telaAtual === 'cadastroAnimal' ? (
            <>
              <div style={styles.pageHeading}>
                <h2 style={styles.pageTitle}>Cadastro do animal</h2>
                <p style={styles.pageSubtitle}>
                  Cadastre gatos e cachorros para aparecerem no fluxo de adoção.
                </p>
              </div>

              <CadastroAnimal token={token} />
            </>
          ) : telaAtual === 'cadastroUsuario' ? (
            <>
              <div style={styles.pageHeading}>
                <h2 style={styles.pageTitle}>Cadastro de funcionário</h2>
                <p style={styles.pageSubtitle}>
                  Crie acessos para funcionários e administradores do sistema.
                </p>
              </div>

              <CadastroUsuario token={token} user={user} />
            </>
          ) : (
            <>
              <div style={styles.pageHeading}>
                <h2 style={styles.pageTitle}>Gerenciamento de solicitações</h2>
                <p style={styles.pageSubtitle}>
                  Analise pedidos de adoção, aprove solicitações ou recuse quando necessário.
                </p>
              </div>

              <section style={styles.statsGrid}>
                {Object.entries(totais).map(([status, total]) => (
                  <div key={status} style={styles.statCard}>
                    <span style={styles.statLabel}>{statusLabel[status as StatusInteresse]}</span>
                    <strong style={styles.statNumber}>{total} pedidos</strong>
                  </div>
                ))}
              </section>

              <section style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>Solicitações recebidas</h2>
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
                            Animal: {interesse.animal?.nome ?? 'Não informado'} •{' '}
                            {statusLabel[interesse.status]}
                          </p>
                          {interesse.mensagem && <p style={styles.message}>{interesse.mensagem}</p>}
                        </div>

                        <div style={styles.actionsInline}>
                          <button
                            type="button"
                            disabled={atualizandoId === interesse.id}
                            onClick={() => atualizarStatus(interesse, 'EM_ANALISE')}
                            style={styles.viewButton}
                          >
                            Ver
                          </button>

                          <button
                            type="button"
                            disabled={atualizandoId === interesse.id}
                            onClick={() => atualizarStatus(interesse, 'APROVADO')}
                            style={styles.approveButton}
                          >
                            Aprovar
                          </button>

                          <button
                            type="button"
                            disabled={atualizandoId === interesse.id}
                            onClick={() => atualizarStatus(interesse, 'REJEITADO')}
                            style={styles.rejectButton}
                          >
                            Recusar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
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
    height: '82px',
    padding: '0 46px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #d6ddd8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandIcon: {
    fontSize: '28px',
  },
  logo: {
    margin: 0,
    color: '#1f2933',
    fontSize: '30px',
  },
  subtitle: {
    margin: '2px 0 0',
    color: '#667085',
    fontSize: '13px',
  },
  topNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#2f3b4d',
    cursor: 'pointer',
    fontSize: '15px',
  },
  logoutButton: {
    minWidth: '104px',
    padding: '9px 18px',
    backgroundColor: '#f5f7f6',
    color: '#2f3b4d',
    border: '1px solid #aab2bd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    minHeight: 'calc(100vh - 82px)',
  },
  sidebar: {
    padding: '24px 22px',
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    borderRight: '1px solid #d6ddd8',
  },
  sidebarTitle: {
    margin: '0 0 24px',
    color: '#1f2933',
    fontSize: '22px',
  },
  sideButton: {
    width: '100%',
    padding: '11px 18px',
    marginBottom: '12px',
    textAlign: 'left',
    border: '1px solid #c8d0d8',
    borderRadius: '4px',
    backgroundColor: '#f5f7f6',
    color: '#2f3b4d',
    cursor: 'pointer',
  },
  sideButtonActive: {
    width: '100%',
    padding: '11px 18px',
    marginBottom: '12px',
    textAlign: 'left',
    border: '1px solid #9ccc9c',
    borderRadius: '4px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    cursor: 'pointer',
  },
  userCard: {
    marginTop: '24px',
    padding: '16px',
    border: '1px solid #c8d0d8',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  userLabel: {
    color: '#667085',
    fontSize: '13px',
  },
  userRole: {
    color: '#667085',
    fontSize: '13px',
  },
  main: {
    padding: '34px 30px',
  },
  pageHeading: {
    marginBottom: '18px',
  },
  pageTitle: {
    margin: 0,
    color: '#1f2933',
    fontSize: '30px',
  },
  pageSubtitle: {
    margin: '4px 0 0',
    color: '#667085',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))',
    gap: '20px',
    marginBottom: '28px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '18px',
    border: '1px solid #c8d0d8',
    borderRadius: '6px',
  },
  statLabel: {
    display: 'block',
    color: '#667085',
    marginBottom: '8px',
  },
  statNumber: {
    display: 'block',
    color: '#1f2933',
    fontSize: '22px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '4px 6px 0 #111',
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
    color: '#1f2933',
    fontSize: '22px',
  },
  cardSubtitle: {
    margin: '4px 0 0',
    color: '#667085',
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
    border: '1px solid #d5dbe2',
    borderRadius: '6px',
    padding: '16px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
  },
  meta: {
    margin: '4px 0 0',
    color: '#2f3b4d',
    fontSize: '14px',
  },
  message: {
    margin: '10px 0 0',
    color: '#667085',
    fontSize: '14px',
  },
  actionsInline: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  viewButton: {
    padding: '8px 12px',
    border: '1px solid #9ccc9c',
    borderRadius: '6px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontWeight: 600,
    cursor: 'pointer',
  },
  approveButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2e7d32',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  rejectButton: {
    padding: '8px 12px',
    border: '1px solid #ef9a9a',
    borderRadius: '6px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
