import React, { useEffect, useMemo, useState } from 'react';
import { FormularioInteresse, type PetPublico } from './FormularioInteresse';

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

  useEffect(() => {
    let cancelado = false;
    const params = new URLSearchParams({ status: 'DISPONIVEL' });

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
  }, [filtroEspecie, filtroSexo, filtroPorte]);

  const totalDisponiveis = useMemo(() => pets.length, [pets]);

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

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
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
            Temos {totalDisponiveis} pets disponíveis esperando uma nova família.
          </p>
        </section>

        <section id="pets" style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Disponíveis</h2>
          </div>

          <div style={styles.filters}>
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
              Nenhum pet disponível com esses filtros.
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

                  <span style={styles.badge}>{especieLabel[pet.especie]}</span>
                  <h3 style={styles.petName}>{pet.nome}</h3>
                  <p style={styles.petInfo}>Idade: {pet.idade}</p>
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
        <div style={styles.footerBrand}>
          <strong style={styles.footerTitle}>AdotaPet</strong>
          <span>© {new Date().getFullYear()} AdotaPet. Todos os direitos reservados.</span>
        </div>

        <div style={styles.footerInfo}>
          <span>Contato: contato@adotapet.org.br</span>
          <span>Ajuda: (51) 99999-0000</span>
          <span>Informações: atendimento de segunda a sexta, 9h às 18h</span>
        </div>
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
    fontFamily: 'Segoe UI, sans-serif',
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
  brandIcon: {
    fontSize: '28px',
  },
  logo: {
    margin: 0,
    color: '#1f2933',
    fontSize: '30px',
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
    fontWeight: 800,
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
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #d5dbe2',
    color: '#667085',
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
    maxWidth: '1184px',
    margin: '0 auto 36px',
    padding: '18px 22px',
    backgroundColor: '#ffffff',
    border: '1px solid #c8d0d8',
    borderRadius: '6px',
    color: '#667085',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxSizing: 'border-box',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  footerTitle: {
    color: '#1f2933',
    fontSize: '16px',
  },
  footerInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: '10px 18px',
    fontSize: '14px',
  },
};
