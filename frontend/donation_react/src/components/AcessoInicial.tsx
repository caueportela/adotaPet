import React, { useState } from 'react';
import whyAdotar1 from '../assets/why-adotar-1.jpg';
import whyAdotar2 from '../assets/why-adotar-2.jpg';
import whyAdotar3 from '../assets/why-adotar-3.jpg';
import bannerPorQueAdotar from '../assets/banner-por-que-adotar.jpg';
import logoPatas from '../assets/logo-patas.png';

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
          <img src={logoPatas} alt="" style={styles.brandLogo} />
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
          <h2 style={styles.title}>Encontre um novo amigo para chamar de seu</h2>
        </section>
      </main>

      <div style={styles.bannerCtaWrapper}>
        <button type="button" onClick={onCliente} style={styles.whyCta}>
          Encontrar meu novo amigo
        </button>
      </div>

      <section style={styles.banner}>
        <picture>
          <img src={bannerPorQueAdotar} alt="" style={styles.bannerImage} />
        </picture>
        <div style={styles.bannerInner}>
          <div style={styles.bannerContent}>
            <h2 style={styles.bannerTitle}>Cada adoção muda uma vida</h2>
            <p style={styles.bannerSubtitle}>
              Adotar é oferecer uma nova chance a um animal que precisa de um lar.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.whySection}>
        <h2 style={styles.whyTitle}>Por que adotar?</h2>

        <div style={styles.whyGrid}>
          <article style={styles.whyCard}>
            <img src={whyAdotar1} alt="" style={styles.whyImage} />
            <p style={styles.whyText}>
              <strong style={styles.whyLead}>Nesse exato momento,</strong>
              <br />
              existem dezenas de cães e gatos esperando um humano para chamar de seu.
            </p>
          </article>

          <article style={styles.whyCard}>
            <img src={whyAdotar2} alt="" style={styles.whyImage} />
            <p style={styles.whyText}>
              <strong style={styles.whyLead}>E não há recompensa maior</strong>
              <br />
              do que vê-los se tornando aquele companheiro alegre e saudável depois de um
              pouco de cuidado e carinho.
            </p>
          </article>

          <article style={styles.whyCard}>
            <img src={whyAdotar3} alt="" style={styles.whyImage} />
            <p style={styles.whyText}>
              <strong style={styles.whyLead}>Pensando bem, a pergunta é outra:</strong>
              <br />
              se você pode mudar o destino de um animal de rua, por que não faria isso?
            </p>
          </article>
        </div>

        <button type="button" onClick={onCliente} style={styles.primaryButton}>
          Ver pets disponíveis
        </button>
      </section>

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
    padding: '64px 24px 16px',
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
    fontWeight: 600,
    fontFamily: "'Fredoka', sans-serif",
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
  bannerCtaWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  banner: {
    position: 'relative',
    width: '100%',
    minHeight: '760px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    marginBottom: '72px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  bannerImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 55%',
  },
  bannerInner: {
    position: 'relative',
    width: '100%',
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '36px 24px',
    boxSizing: 'border-box',
  },
  bannerContent: {
    maxWidth: '560px',
    marginLeft: '43%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '14px',
    transform: 'translate(27px, -5px)',
  },
  bannerTitle: {
    margin: 0,
    color: '#1f2933',
    fontSize: '34px',
    lineHeight: 1.15,
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
  },
  bannerSubtitle: {
    margin: 0,
    color: '#1f2933',
    fontSize: '26px',
    lineHeight: 1.5,
  },
  bannerBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    margin: '6px 0 10px',
  },
  bannerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 700,
  },
  bannerBadgeIcon: {
    fontSize: '15px',
    lineHeight: 1,
  },
  whySection: {
    width: '100%',
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '0 24px 72px',
    textAlign: 'center',
  },
  whyTitle: {
    margin: '0 0 28px',
    color: '#1f2933',
    fontSize: '46px',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  whyCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '18px',
    padding: '28px',
    textAlign: 'left',
    backgroundColor: '#ffffff',
    border: '1px solid #9ccc9c',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.08)',
  },
  whyImage: {
    width: '84px',
    height: '84px',
    flexShrink: 0,
    objectFit: 'contain',
    borderRadius: '8px',
  },
  whyText: {
    margin: 0,
    color: '#667085',
    fontSize: '16px',
    lineHeight: 1.5,
  },
  whyLead: {
    color: '#1f2933',
    fontSize: '17px',
  },
  whyCta: {
    minWidth: '280px',
    padding: '17px 32px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#2e7d32',
    color: '#ffffff',
    boxShadow: '0 10px 0 #1b5e20',
    fontSize: '18px',
    fontWeight: 800,
    cursor: 'pointer',
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
