import React, { useEffect, useMemo, useState } from 'react';
import { FormularioInteresse, type PetPublico } from './FormularioInteresse';
import logoPatas from '../assets/logo-patas.png';
import petNaoEncontrado from '../assets/pet-nao-encontrado.png';

interface ClienteHomeProps {
  onBackHome: () => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const especieLabel: Record<PetPublico['especie'], string> = {
  CACHORRO: 'Cachorro',
  GATO: 'Gatinho',
};

const sexoLabel: Record<string, string> = {
  MACHO: 'macho',
  FEMEA: 'fêmea',
};

const porteLabel: Record<string, string> = {
  PEQUENO: 'pequeno',
  MEDIO: 'médio',
  GRANDE: 'grande',
};

type FiltroEspecie = 'TODOS' | PetPublico['especie'];
type FiltroSexo = 'TODOS' | NonNullable<PetPublico['sexoAnimal']>;
type FiltroPorte = 'TODOS' | NonNullable<PetPublico['porte']>;

const filtrosEspecie: Array<{ label: string; value: FiltroEspecie }> = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Cachorros', value: 'CACHORRO' },
  { label: 'Gatos', value: 'GATO' },
];

const filtrosSexo: Array<{ label: string; value: FiltroSexo }> = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Macho', value: 'MACHO' },
  { label: 'Fêmea', value: 'FEMEA' },
];

const filtrosPorte: Array<{ label: string; value: FiltroPorte }> = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Pequeno', value: 'PEQUENO' },
  { label: 'Médio', value: 'MEDIO' },
  { label: 'Grande', value: 'GRANDE' },
];

export const ClienteHome: React.FC<ClienteHomeProps> = ({ onBackHome }) => {
  const [pets, setPets] = useState<PetPublico[]>([]);
  const [petSelecionado, setPetSelecionado] = useState<PetPublico | null>(null);
  const [filtroEspecie, setFiltroEspecie] = useState<FiltroEspecie>('TODOS');
  const [filtroSexo, setFiltroSexo] = useState<FiltroSexo>('TODOS');
  const [filtroPorte, setFiltroPorte] = useState<FiltroPorte>('TODOS');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [totalGeral, setTotalGeral] = useState<number | null>(null);
  const [abaStatus, setAbaStatus] = useState<'DISPONIVEL' | 'EM_PROCESSO'>('DISPONIVEL');

  useEffect(() => {
    let cancelado = false;

    fetch(`${API_URL}/animal?status=DISPONIVEL`)
      .then(async (resposta) => {
        const data = await resposta.json();

        if (resposta.ok && !cancelado) {
          setTotalGeral(Array.isArray(data) ? data.length : 0);
        }
      })
      .catch(() => {
        // Se essa chamada falhar, o hero simplesmente mantém o placeholder de carregamento.
      });

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    let cancelado = false;
    const params = new URLSearchParams({ status: abaStatus });

    if (filtroEspecie !== 'TODOS') {
      params.set('especie', filtroEspecie);
    }

    if (filtroSexo !== 'TODOS') {
      params.set('sexoAnimal', filtroSexo);
    }

    if (filtroPorte !== 'TODOS') {
      params.set('porte', filtroPorte);
    }

    fetch(`${API_URL}/animal?${params.toString()}`)
      .then(async (resposta) => {
        const data = await resposta.json();

        if (!resposta.ok) {
          throw new Error(data.message || 'Não foi possível carregar os pets.');
        }

        if (!cancelado) {
          setPets(data);
        }
      })
      .catch((error) => {
        if (!cancelado) {
          setErro(error instanceof Error ? error.message : 'Erro ao carregar pets.');
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
  }, [filtroEspecie, filtroSexo, filtroPorte, abaStatus]);

  const filtrosAtivos = useMemo(
    () => filtroEspecie !== 'TODOS' || filtroSexo !== 'TODOS' || filtroPorte !== 'TODOS',
    [filtroEspecie, filtroSexo, filtroPorte],
  );

  const limparFiltros = () => {
    setErro(null);
    setCarregando(true);
    setFiltroEspecie('TODOS');
    setFiltroSexo('TODOS');
    setFiltroPorte('TODOS');
  };

  const trocarFiltroEspecie = (novoFiltro: FiltroEspecie) => {
    if (novoFiltro === filtroEspecie) {
      return;
    }

    setErro(null);
    setCarregando(true);
    setFiltroEspecie(novoFiltro);
  };

  const trocarFiltroSexo = (novoFiltro: FiltroSexo) => {
    if (novoFiltro === filtroSexo) {
      return;
    }

    setErro(null);
    setCarregando(true);
    setFiltroSexo(novoFiltro);
  };

  const trocarFiltroPorte = (novoFiltro: FiltroPorte) => {
    if (novoFiltro === filtroPorte) {
      return;
    }

    setErro(null);
    setCarregando(true);
    setFiltroPorte(novoFiltro);
  };

  const trocarAba = (novaAba: 'DISPONIVEL' | 'EM_PROCESSO') => {
    if (novaAba === abaStatus) {
      return;
    }

    setErro(null);
    setCarregando(true);
    setAbaStatus(novaAba);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <img src={logoPatas} alt="" style={styles.brandLogo} />
          <span style={styles.brandIcon}>🐾</span>
          <h1 style={styles.logo}>AdotaPet</h1>
        </div>

        <nav style={styles.nav}>
          <a href="#pets" style={styles.navLink}>
            Pets
          </a>
          <button onClick={onBackHome} style={styles.backButton}>
            Voltar
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h2 style={styles.title}>Olá, escolha um pet para adotar</h2>
          <p style={styles.subtitle}>
            Temos {totalGeral ?? '...'} pets disponíveis esperando uma nova família.
          </p>
        </section>

        <section id="pets" style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTabs}>
              <button
                type="button"
                onClick={() => trocarAba('DISPONIVEL')}
                style={abaStatus === 'DISPONIVEL' ? styles.sectionTabActive : styles.sectionTab}
              >
                Disponíveis
              </button>
              <button
                type="button"
                onClick={() => trocarAba('EM_PROCESSO')}
                style={abaStatus === 'EM_PROCESSO' ? styles.sectionTabActive : styles.sectionTab}
              >
                Em processo
              </button>
            </div>
            {!carregando && <span style={styles.resultCount}>{pets.length} resultado(s)</span>}
          </div>

          <div style={styles.filters}>
            {filtrosAtivos && (
              <div style={styles.filtersHeader}>
                <button type="button" onClick={limparFiltros} style={styles.clearFiltersButton}>
                  Limpar filtros
                </button>
              </div>
            )}

            <div style={styles.filterRow}>
              <span style={styles.filterLabel}>Tipo:</span>
              <div style={styles.filterButtons}>
                {filtrosEspecie.map((filtro) => (
                  <button
                    key={filtro.value}
                    type="button"
                    onClick={() => trocarFiltroEspecie(filtro.value)}
                    style={
                      filtroEspecie === filtro.value
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                  >
                    {filtro.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.filterRow}>
              <span style={styles.filterLabel}>Sexo:</span>
              <div style={styles.filterButtons}>
                {filtrosSexo.map((filtro) => (
                  <button
                    key={filtro.value}
                    type="button"
                    onClick={() => trocarFiltroSexo(filtro.value)}
                    style={
                      filtroSexo === filtro.value
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                  >
                    {filtro.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.filterRow}>
              <span style={styles.filterLabel}>Porte:</span>
              <div style={styles.filterButtons}>
                {filtrosPorte.map((filtro) => (
                  <button
                    key={filtro.value}
                    type="button"
                    onClick={() => trocarFiltroPorte(filtro.value)}
                    style={
                      filtroPorte === filtro.value
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                  >
                    {filtro.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {erro && <div style={styles.errorBanner}>{erro}</div>}

          {carregando ? (
            <p>Carregando pets...</p>
          ) : pets.length === 0 ? (
            <div style={styles.emptyCard}>
              <img src={petNaoEncontrado} alt="" style={styles.emptyImage} />
              <p style={styles.emptyText}>Nenhum pet disponível com esses filtros.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {pets.map((pet) => (
                <article key={pet.id} style={styles.card}>
                  <div style={styles.photoBox}>
                    {pet.fotoUrl ? (
                      <img src={pet.fotoUrl} alt={pet.nome} style={styles.petImage} />
                    ) : (
                      <span>{pet.especie === 'GATO' ? 'Foto do gato' : 'Foto do cachorro'}</span>
                    )}
                  </div>

                  <div style={styles.badgeRow}>
                    <span style={styles.badge}>{especieLabel[pet.especie]}</span>
                    {pet.status === 'EM_PROCESSO' && (
                      <span style={styles.badgeEmProcesso}>Em processo</span>
                    )}
                  </div>
                  <h3 style={styles.petName}>{pet.nome}</h3>
                  <p style={styles.petInfo}>Idade: {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</p>
                  {pet.raca && <p style={styles.petInfo}>Raça: {pet.raca}</p>}
                  {pet.sexoAnimal && <p style={styles.petInfo}>Sexo: {sexoLabel[pet.sexoAnimal]}</p>}
                  {pet.porte && <p style={styles.petInfo}>Porte: {porteLabel[pet.porte]}</p>}
                  {pet.descricao && <p style={styles.petDescription}>{pet.descricao}</p>}

                  <button onClick={() => setPetSelecionado(pet)} style={styles.adoptButton}>
                    Adotar este
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerDividerTop} />

        <div style={styles.footerSocial}>
          <a href="#" aria-label="Facebook" style={styles.socialButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" style={styles.socialButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" style={styles.socialButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a href="#" aria-label="Twitter" style={styles.socialButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </a>
        </div>

        <div style={styles.footerLinks}>
          <a href="mailto:contato@adotapet.org.br" style={styles.footerLink}>Contato</a>
          <a href="tel:+5551999990000" style={styles.footerLink}>Ajuda</a>
          <span style={styles.footerLink}>Seg a sex, 9h às 18h</span>
        </div>

        <div style={styles.footerDividerBottom} />

        <p style={styles.footerCopy}>
          © {new Date().getFullYear()} AdotaPet. Todos os direitos reservados.
        </p>
      </footer>

      {petSelecionado && (
        <FormularioInteresse pet={petSelecionado} onClose={() => setPetSelecionado(null)} />
      )}
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
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
  },
  header: {
    height: '82px',
    padding: '0 46px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #d6ddd8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandLogo: {
    width: '56px',
    height: '56px',
    objectFit: 'contain',
  },
  brandIcon: {
    fontSize: '28px',
  },
  logo: {
    margin: 0,
    color: '#1f2933',
    fontSize: '30px',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    color: '#2f3b4d',
    textDecoration: 'none',
  },
  backButton: {
    minWidth: '92px',
    padding: '9px 18px',
    backgroundColor: '#ffffff',
    color: '#2f3b4d',
    border: '1px solid #aab2bd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    width: '100%',
    maxWidth: '1184px',
    margin: '0 auto',
    padding: '34px 24px',
  },
  hero: {
    marginBottom: '26px',
  },
  title: {
    margin: 0,
    color: '#1f2933',
    fontSize: '32px',
    fontWeight: 600,
    fontFamily: "'Fredoka', sans-serif",
  },
  subtitle: {
    margin: '6px 0 0',
    color: '#667085',
    fontSize: '17px',
  },
  section: {
    marginTop: '20px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '12px',
    borderBottom: '3px solid #d5dbe2',
    marginBottom: '28px',
  },
  sectionTitle: {
    margin: '0 0 -3px',
    display: 'inline-block',
    color: '#1f2933',
    borderBottom: '3px solid #1f2933',
    fontSize: '22px',
  },
  sectionTabs: {
    display: 'flex',
    gap: '8px',
  },
  sectionTab: {
    padding: '8px 16px',
    border: '1px solid #d5dbe2',
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    color: '#667085',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  sectionTabActive: {
    padding: '8px 16px',
    border: '1px solid #1f2933',
    borderRadius: '999px',
    backgroundColor: '#1f2933',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  resultCount: {
    marginBottom: '4px',
    color: '#667085',
    fontSize: '14px',
  },
  filters: {
    marginBottom: '24px',
    padding: '14px 16px',
    border: '1px solid #d7e0da',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  clearFiltersButton: {
    padding: 0,
    background: 'none',
    border: 'none',
    color: '#2e7d32',
    fontWeight: 700,
    fontSize: '13px',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: '72px 1fr',
    alignItems: 'center',
    gap: '12px',
  },
  filterLabel: {
    color: '#2f3b4d',
    fontWeight: 700,
    fontSize: '14px',
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  filterButton: {
    padding: '9px 14px',
    border: '1px solid #c8d0d8',
    borderRadius: '6px',
    backgroundColor: '#f5f7f6',
    color: '#2f3b4d',
    cursor: 'pointer',
    fontWeight: 700,
  },
  filterButtonActive: {
    padding: '9px 14px',
    border: '1px solid #9ccc9c',
    borderRadius: '6px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    cursor: 'pointer',
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 315px))',
    justifyContent: 'center',
    gap: '28px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #d7e0da',
    boxShadow: '0 12px 24px rgba(31, 41, 51, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '430px',
  },
  photoBox: {
    height: '210px',
    border: '1px solid #aab2bd',
    borderRadius: '6px',
    backgroundColor: '#f5f7f6',
    display: 'grid',
    placeItems: 'center',
    color: '#667085',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  badge: {
    width: 'fit-content',
    padding: '5px 10px',
    border: '1px solid #9ccc9c',
    borderRadius: '6px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  badgeEmProcesso: {
    width: 'fit-content',
    padding: '5px 10px',
    border: '1px solid #f2c94c',
    borderRadius: '6px',
    backgroundColor: '#fff8e1',
    color: '#8a6d00',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  petName: {
    margin: '14px 0 8px',
    color: '#1f2933',
    fontSize: '22px',
  },
  petInfo: {
    margin: '3px 0',
    color: '#2f3b4d',
    fontSize: '15px',
  },
  petDescription: {
    margin: '10px 0 0',
    color: '#667085',
    fontSize: '14px',
    lineHeight: 1.35,
  },
  adoptButton: {
    marginTop: 'auto',
    padding: '12px 14px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2e7d32',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '15px',
    boxShadow: '0 4px 0 #1b5e20',
    cursor: 'pointer',
  },
  emptyCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#ffffff',
    padding: '32px 24px',
    borderRadius: '8px',
    border: '1px solid #d5dbe2',
    color: '#667085',
    textAlign: 'center',
  },
  emptyImage: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
  },
  emptyText: {
    margin: 0,
    fontSize: '15px',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px 12px',
    borderRadius: '6px',
    marginBottom: '16px',
    border: '1px solid #ffcdd2',
  },
  footer: {
    width: '100%',
    padding: '28px 24px 24px',
    backgroundColor: '#2e7d32',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
    boxSizing: 'border-box',
  },
  footerDividerTop: {
    width: '100%',
    maxWidth: '760px',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  footerDividerBottom: {
    width: '100%',
    maxWidth: '760px',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  footerSocial: {
    display: 'flex',
    gap: '14px',
  },
  socialButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid #9ccc9c',
    backgroundColor: '#ffffff',
    color: '#2e7d32',
    display: 'grid',
    placeItems: 'center',
    textDecoration: 'none',
  },
  footerLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px 28px',
  },
  footerLink: {
    color: '#ffffff',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255, 255, 255, 0.6)',
    textUnderlineOffset: '6px',
    fontSize: '16px',
    fontWeight: 700,
  },
  footerCopy: {
    margin: 0,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '15px',
  },
};
