import React, { useState } from 'react';

export type PetPublico = {
  id: string;
  nome: string;
  especie: 'CACHORRO' | 'GATO';
  idade: number;
  raca?: string | null;
  sexoAnimal?: 'MACHO' | 'FEMEA';
  porte?: 'PEQUENO' | 'MEDIO' | 'GRANDE';
  descricao?: string | null;
  fotoUrl?: string | null;
};

type InteresseForm = {
  nomeInteressado: string;
  email: string;
  telefone: string;
  mensagem: string;
};

interface FormularioInteresseProps {
  pet: PetPublico;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const initialForm: InteresseForm = {
  nomeInteressado: '',
  email: '',
  telefone: '',
  mensagem: '',
};

export const FormularioInteresse: React.FC<FormularioInteresseProps> = ({ pet, onClose }) => {
  const [form, setForm] = useState<InteresseForm>(initialForm);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const enviarInteresse = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!form.nomeInteressado || !form.email || !form.telefone) {
      setErro('Preencha nome, e-mail e telefone para contato.');
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(`${API_URL}/interesse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: pet.id,
          nomeInteressado: form.nomeInteressado,
          email: form.email,
          telefone: form.telefone,
          mensagem: form.mensagem || undefined,
        }),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível enviar seu interesse.');
      }

      setSucesso(`Interesse enviado para adoção de ${pet.nome}.`);
      setForm(initialForm);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao enviar interesse.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <section style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Tenho interesse em {pet.nome}</h2>
            <p style={styles.subtitle}>Deixe seus dados para a equipe entrar em contato.</p>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            Fechar
          </button>
        </div>

        {erro && <div style={styles.error}>{erro}</div>}
        {sucesso && <div style={styles.success}>{sucesso}</div>}

        <form onSubmit={enviarInteresse} style={styles.form}>
          <label style={styles.field}>
            Nome completo
            <input
              name="nomeInteressado"
              value={form.nomeInteressado}
              onChange={handleChange}
              placeholder="Ex: Paula Santos"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            E-mail
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@email.com"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            Telefone
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 90000-0000"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            Mensagem
            <textarea
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              placeholder="Conte um pouco sobre você e sua casa..."
              style={styles.textarea}
            />
          </label>

          <button type="submit" disabled={enviando} style={styles.submitButton}>
            {enviando ? 'Enviando...' : 'Enviar interesse'}
          </button>
        </form>
      </section>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    zIndex: 20,
  },
  modal: {
    width: '100%',
    maxWidth: '520px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '4px 6px 0 #111',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '18px',
  },
  title: {
    margin: 0,
    color: '#1f2933',
    fontSize: '22px',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#667085',
  },
  closeButton: {
    padding: '8px 12px',
    border: '1px solid #c8d0d8',
    borderRadius: '6px',
    backgroundColor: '#f5f7f6',
    cursor: 'pointer',
  },
  form: {
    display: 'grid',
    gap: '14px',
  },
  field: {
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
  textarea: {
    minHeight: '86px',
    padding: '10px 12px',
    border: '1px solid #aab2bd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
  },
  submitButton: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2e7d32',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    marginBottom: '14px',
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '6px',
  },
  success: {
    marginBottom: '14px',
    padding: '10px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '6px',
  },
};
