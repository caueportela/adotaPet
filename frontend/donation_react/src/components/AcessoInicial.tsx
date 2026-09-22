import React, { useState } from 'react';

interface AcessoInicialProps {
  onCliente: () => void;
  onFuncionario: () => void;
  onAdmin: () => void;
}

export const AcessoInicial: React.FC<AcessoInicialProps> = ({
  onCliente,
  onFuncionario,
  onAdmin,
}) => {
  const [mostrarEquipe, setMostrarEquipe] = useState(false);

  const entrarComoFuncionario = () => {
    setMostrarEquipe(false);
    onFuncionario();
  };

  const entrarComoAdmin = () => {
    setMostrarEquipe(false);
    onAdmin();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🐾</span>
          <h1 style={styles.logo}>AdotaPet</h1>
        </div>

        <div style={styles.staffArea}>
          <button
            type="button"
            onClick={() => setMostrarEquipe((atual) => !atual)}
            style={styles.staffButton}
          >
            Entrar como equipe
          </button>

          {mostrarEquipe && (
            <div style={styles.staffMenu}>
              <button type="button" onClick={entrarComoFuncionario} style={styles.staffMenuItem}>
                Funcionário
              </button>
              <button type="button" onClick={entrarComoAdmin} style={styles.staffMenuItem}>
                Administrador
              </button>
            </div>
          )}
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <span style={styles.badge}>Adoção responsável</span>
          <h2 style={styles.title}>Encontre um novo amigo para chamar de seu</h2>
          <p style={styles.subtitle}>
            Conheça os pets disponíveis para adoção e envie seu interesse em poucos passos.
          </p>
          <button type="button" onClick={onCliente} style={styles.primaryButton}>
            Ver pets disponíveis
          </button>
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
    display: 'flex',
    flexDirection: 'column',
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
  staffArea: {
    position: 'relative',
  },
  staffButton: {
    minWidth: '176px',
    padding: '10px 18px',
    backgroundColor: '#f5f7f6',
    color: '#2f3b4d',
    border: '1px solid #aab2bd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  staffMenu: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '220px',
    padding: '10px',
    border: '1px solid #c8d0d8',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 12px 26px rgba(15, 23, 42, 0.16)',
    display: 'grid',
    gap: '8px',
    zIndex: 2,
  },
  staffMenuItem: {
    padding: '11px 12px',
    border: '1px solid #d5dbe2',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#2f3b4d',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 600,
  },
  main: {
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '64px 24px 56px',
    flex: 1,
    display: 'grid',
    alignItems: 'center',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '760px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '18px',
    padding: '7px 14px',
    border: '1px solid #b7dfbd',
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    color: '#2e7d32',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    color: '#1f2933',
    fontSize: '46px',
    lineHeight: 1.08,
    fontWeight: 800,
  },
  subtitle: {
    margin: '16px auto 0',
    maxWidth: '610px',
    color: '#667085',
    fontSize: '18px',
    lineHeight: 1.5,
  },
  primaryButton: {
    marginTop: '28px',
    minWidth: '240px',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2e7d32',
    color: '#ffffff',
    boxShadow: '0 8px 0 #1b5e20',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  footer: {
    width: 'calc(100% - 48px)',
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
