import React, { useEffect, useRef, useState } from 'react';

type Especie = 'CACHORRO' | 'GATO';
type SexoAnimal = 'MACHO' | 'FEMEA';
type PorteAnimal = 'PEQUENO' | 'MEDIO' | 'GRANDE';
type StatusAnimal = 'DISPONIVEL' | 'EM_PROCESSO' | 'ADOTADO';
type FotoPosition = {
  x: number;
  y: number;
};

type Animal = {
  id: string;
  nome: string;
  especie: Especie;
  idade: number;
  raca?: string | null;
  sexoAnimal: SexoAnimal;
  porte: PorteAnimal;
  descricao?: string | null;
  fotoUrl?: string | null;
  observacao?: string | null;
  status: StatusAnimal;
};

type AnimalForm = {
  nome: string;
  especie: Especie;
  idade: string;
  raca: string;
  sexoAnimal: SexoAnimal;
  porte: PorteAnimal;
  descricao: string;
  fotoUrl: string;
  observacao: string;
};

interface CadastroAnimalProps {
  token: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const initialForm: AnimalForm = {
  nome: '',
  especie: 'GATO',
  idade: '',
  raca: '',
  sexoAnimal: 'FEMEA',
  porte: 'PEQUENO',
  descricao: '',
  fotoUrl: '',
  observacao: '',
};

const especieLabel: Record<Especie, string> = {
  CACHORRO: 'Cachorro',
  GATO: 'Gato',
};

const statusLabel: Record<StatusAnimal, string> = {
  DISPONIVEL: 'Disponível',
  EM_PROCESSO: 'Em processo',
  ADOTADO: 'Adotado',
};

const initialFotoPosition: FotoPosition = {
  x: 50,
  y: 50,
};

const clampPosition = (value: number) => Math.min(100, Math.max(0, value));

const prepararFotoArquivo = (arquivo: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    const objectUrl = URL.createObjectURL(arquivo);

    imagem.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const maiorLado = 1000;
      const escala = Math.min(1, maiorLado / Math.max(imagem.naturalWidth, imagem.naturalHeight));
      const largura = Math.round(imagem.naturalWidth * escala);
      const altura = Math.round(imagem.naturalHeight * escala);
      const canvas = document.createElement('canvas');
      canvas.width = largura;
      canvas.height = altura;

      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Não foi possível preparar a foto.'));
        return;
      }

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, largura, altura);
      context.drawImage(imagem, 0, 0, largura, altura);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };

    imagem.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Não foi possível carregar essa imagem. Tente usar uma foto JPG ou PNG.'));
    };

    imagem.src = objectUrl;
  });
};

export const CadastroAnimal: React.FC<CadastroAnimalProps> = ({ token }) => {
  const [form, setForm] = useState<AnimalForm>(initialForm);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [fotoPosition, setFotoPosition] = useState<FotoPosition>(initialFotoPosition);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [carregandoAnimais, setCarregandoAnimais] = useState(true);
  const [animalEmEdicaoId, setAnimalEmEdicaoId] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const fotoInputRef = useRef<HTMLInputElement | null>(null);
  const fotoBoxRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    position: FotoPosition;
  } | null>(null);

  const carregarAnimais = async () => {
    setCarregandoAnimais(true);

    try {
      const resposta = await fetch(`${API_URL}/animal`);
      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(data.message || 'Não foi possível carregar os animais.');
      }

      setAnimais(data);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar animais.');
    } finally {
      setCarregandoAnimais(false);
    }
  };

  useEffect(() => {
    let cancelado = false;

    fetch(`${API_URL}/animal`)
      .then(async (resposta) => {
        const data = await resposta.json();

        if (!resposta.ok) {
          throw new Error(data.message || 'Não foi possível carregar os animais.');
        }

        if (!cancelado) {
          setAnimais(data);
        }
      })
      .catch((error) => {
        if (!cancelado) {
          setErro(error instanceof Error ? error.message : 'Erro ao carregar animais.');
        }
      })
      .finally(() => {
        if (!cancelado) {
          setCarregandoAnimais(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const dragStart = dragStartRef.current;
      const fotoBox = fotoBoxRef.current;

      if (!dragStart || !fotoBox) {
        return;
      }

      const rect = fotoBox.getBoundingClientRect();
      const deltaX = ((event.clientX - dragStart.startX) / rect.width) * 100;
      const deltaY = ((event.clientY - dragStart.startY) / rect.height) * 100;

      setFotoPosition({
        x: clampPosition(dragStart.position.x - deltaX),
        y: clampPosition(dragStart.position.y - deltaY),
      });
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const handleFotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!arquivo.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem.');
      return;
    }

    try {
      const fotoPreparada = await prepararFotoArquivo(arquivo);
      setForm((atual) => ({ ...atual, fotoUrl: fotoPreparada }));
      setFotoPosition(initialFotoPosition);
      setErro(null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar a imagem.');
    } finally {
      event.target.value = '';
    }
  };

  const abrirSeletorFoto = () => {
    fotoInputRef.current?.click();
  };

  const handleFotoMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!form.fotoUrl) {
      return;
    }

    event.preventDefault();
    dragStartRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      position: fotoPosition,
    };
  };

  const recortarFoto = (fotoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const imagem = new Image();
      imagem.onload = () => {
        const larguraFinal = 480;
        const alturaFinal = 360;
        const proporcaoFinal = larguraFinal / alturaFinal;
        const proporcaoImagem = imagem.naturalWidth / imagem.naturalHeight;

        let sx = 0;
        let sy = 0;
        let sw = imagem.naturalWidth;
        let sh = imagem.naturalHeight;

        if (proporcaoImagem > proporcaoFinal) {
          sw = imagem.naturalHeight * proporcaoFinal;
          sx = (imagem.naturalWidth - sw) * (fotoPosition.x / 100);
        } else {
          sh = imagem.naturalWidth / proporcaoFinal;
          sy = (imagem.naturalHeight - sh) * (fotoPosition.y / 100);
        }

        const canvas = document.createElement('canvas');
        canvas.width = larguraFinal;
        canvas.height = alturaFinal;
        const context = canvas.getContext('2d');

        if (!context) {
          resolve(fotoUrl);
          return;
        }

        context.drawImage(imagem, sx, sy, sw, sh, 0, 0, larguraFinal, alturaFinal);
        resolve(canvas.toDataURL('image/jpeg', 0.68));
      };

      imagem.onerror = () => {
        resolve(fotoUrl);
      };

      imagem.src = fotoUrl;
    });
  };

  const limpar = () => {
    setForm(initialForm);
    setFotoPosition(initialFotoPosition);
    setAnimalEmEdicaoId(null);
    setErro(null);
    setSucesso(null);
    if (fotoInputRef.current) {
      fotoInputRef.current.value = '';
    }
  };

  const editarAnimal = (animal: Animal) => {
    setForm({
      nome: animal.nome,
      especie: animal.especie,
      idade: String(animal.idade),
      raca: animal.raca ?? '',
      sexoAnimal: animal.sexoAnimal,
      porte: animal.porte,
      descricao: animal.descricao ?? '',
      fotoUrl: animal.fotoUrl ?? '',
      observacao: animal.observacao ?? '',
    });
    setFotoPosition(initialFotoPosition);
    setAnimalEmEdicaoId(animal.id);
    setErro(null);
    setSucesso(null);
  };

  const salvarAnimal = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);
    setSucesso(null);

    const idadeNumerica = Number(form.idade);

    if (!form.nome || !form.idade) {
      setErro('Preencha nome e idade do animal.');
      return;
    }

    if (!Number.isFinite(idadeNumerica)) {
      setErro('A idade precisa ser um número. Exemplo: 1, 2, 3.');
      return;
    }

    setSalvando(true);

    try {
      const fotoUrl = form.fotoUrl ? await recortarFoto(form.fotoUrl) : undefined;
      const resposta = await fetch(
        animalEmEdicaoId ? `${API_URL}/animal/${animalEmEdicaoId}` : `${API_URL}/animal`,
        {
        method: animalEmEdicaoId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: form.nome,
          especie: form.especie,
          idade: idadeNumerica,
          raca: form.raca || undefined,
          sexoAnimal: form.sexoAnimal,
          porte: form.porte,
          descricao: form.descricao || undefined,
          fotoUrl,
          observacao: form.observacao || undefined,
        }),
      },
      );

      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          data.message ||
            (animalEmEdicaoId
              ? 'Não foi possível editar o animal.'
              : 'Não foi possível cadastrar o animal.'),
        );
      }

      setAnimais((atuais) =>
        animalEmEdicaoId
          ? atuais.map((animal) => (animal.id === animalEmEdicaoId ? data : animal))
          : [data, ...atuais],
      );
      setSucesso(animalEmEdicaoId ? `Animal atualizado: ${data.nome}` : `Animal cadastrado: ${data.nome}`);
      setForm(initialForm);
      setFotoPosition(initialFotoPosition);
      setAnimalEmEdicaoId(null);
      if (fotoInputRef.current) {
        fotoInputRef.current.value = '';
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao cadastrar animal.');
    } finally {
      setSalvando(false);
    }
  };

  const apagarAnimal = async (animal: Animal) => {
    const confirmou = window.confirm(`Apagar o cadastro de ${animal.nome}?`);

    if (!confirmou) {
      return;
    }

    setExcluindoId(animal.id);
    setErro(null);
    setSucesso(null);

    try {
      const resposta = await fetch(`${API_URL}/animal/${animal.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        const data = await resposta.json();
        throw new Error(data.message || 'Não foi possível apagar o animal.');
      }

      setAnimais((atuais) => atuais.filter((item) => item.id !== animal.id));
      setSucesso(`Animal apagado: ${animal.nome}`);

      if (animalEmEdicaoId === animal.id) {
        setAnimalEmEdicaoId(null);
        setForm(initialForm);
        setFotoPosition(initialFotoPosition);
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao apagar animal.');
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>
          {animalEmEdicaoId ? 'Editar animal' : 'Cadastro do animal'}
        </h2>
        <p style={styles.subtitle}>
          Formulário simples para cadastrar gatos e cachorros disponíveis.
        </p>

        {erro && <div style={styles.error}>{erro}</div>}
        {sucesso && <div style={styles.success}>{sucesso}</div>}

        <form onSubmit={salvarAnimal} style={styles.form}>
          <label style={styles.field}>
            Nome do animal
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Pipoca"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            Espécie
            <select name="especie" value={form.especie} onChange={handleChange} style={styles.input}>
              <option value="GATO">Gato</option>
              <option value="CACHORRO">Cachorro</option>
            </select>
          </label>

          <label style={styles.field}>
            Idade
            <input
              name="idade"
              value={form.idade}
              onChange={handleChange}
              placeholder="Ex: 1"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            Raça
            <input
              name="raca"
              value={form.raca}
              onChange={handleChange}
              placeholder="vira-lata"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            Sexo
            <select
              name="sexoAnimal"
              value={form.sexoAnimal}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="FEMEA">Fêmea</option>
              <option value="MACHO">Macho</option>
            </select>
          </label>

          <label style={styles.field}>
            Porte
            <select name="porte" value={form.porte} onChange={handleChange} style={styles.input}>
              <option value="PEQUENO">Pequeno</option>
              <option value="MEDIO">Médio</option>
              <option value="GRANDE">Grande</option>
            </select>
          </label>

          <label style={styles.fullField}>
            Características
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Calmo, gosta de colo, convive com outros animais..."
              style={styles.textarea}
            />
          </label>

          <label style={styles.fullField}>
            Observações de saúde
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              placeholder="Vacinado, castrado, vermifugado..."
              style={styles.textarea}
            />
          </label>

          <div style={styles.actions}>
            <button type="button" onClick={limpar} style={styles.clearButton}>
              Limpar
            </button>

            <button type="submit" disabled={salvando} style={styles.saveButton}>
              {salvando ? 'Salvando...' : animalEmEdicaoId ? 'Salvar edição' : 'Salvar animal'}
            </button>
          </div>
        </form>
      </div>

      <aside style={styles.sideCard}>
        <h2 style={styles.title}>Foto e status</h2>

        <div
          ref={fotoBoxRef}
          onMouseDown={handleFotoMouseDown}
          onClick={form.fotoUrl ? undefined : abrirSeletorFoto}
          style={{ ...styles.photoBox, cursor: form.fotoUrl ? 'grab' : 'pointer' }}
        >
          {form.fotoUrl ? (
            <div
              aria-label={form.nome || 'Animal'}
              role="img"
              style={{
                ...styles.previewImage,
                backgroundImage: `url("${form.fotoUrl}")`,
                backgroundPosition: `${fotoPosition.x}% ${fotoPosition.y}%`,
              }}
            />
          ) : (
            'Adicionar foto do animal'
          )}
        </div>

        {form.fotoUrl ? (
          <p style={styles.photoHelp}>Arraste a foto para ajustar o enquadramento.</p>
        ) : (
          <p style={styles.photoHelp}>Escolha uma imagem do animal para aparecer no site.</p>
        )}

        {form.fotoUrl && (
          <div style={styles.photoControls}>
            <label style={styles.rangeLabel}>
              Horizontal
              <input
                type="range"
                min="0"
                max="100"
                value={fotoPosition.x}
                onChange={(event) =>
                  setFotoPosition((atual) => ({ ...atual, x: Number(event.target.value) }))
                }
                style={styles.rangeInput}
              />
            </label>

            <label style={styles.rangeLabel}>
              Vertical
              <input
                type="range"
                min="0"
                max="100"
                value={fotoPosition.y}
                onChange={(event) =>
                  setFotoPosition((atual) => ({ ...atual, y: Number(event.target.value) }))
                }
                style={styles.rangeInput}
              />
            </label>
          </div>
        )}

        <button type="button" onClick={abrirSeletorFoto} style={styles.photoButton}>
          {form.fotoUrl ? 'Trocar foto' : 'Adicionar foto'}
        </button>

        <input
          ref={fotoInputRef}
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          style={styles.fileInput}
        />

        <p style={styles.statusText}>Status inicial: disponível</p>
      </aside>

      <section style={styles.listCard}>
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.title}>Animais cadastrados</h2>
            <p style={styles.subtitle}>Edite ou apague pets já cadastrados no sistema.</p>
          </div>

          <button type="button" onClick={carregarAnimais} style={styles.reloadButton}>
            Atualizar
          </button>
        </div>

        {carregandoAnimais ? (
          <p style={styles.statusText}>Carregando animais...</p>
        ) : animais.length === 0 ? (
          <p style={styles.statusText}>Nenhum animal cadastrado ainda.</p>
        ) : (
          <div style={styles.animalList}>
            {animais.map((animal) => (
              <article key={animal.id} style={styles.animalItem}>
                <div style={styles.animalSummary}>
                  {animal.fotoUrl ? (
                    <img src={animal.fotoUrl} alt={animal.nome} style={styles.thumbnail} />
                  ) : (
                    <div style={styles.thumbnailPlaceholder}>Foto</div>
                  )}

                  <div>
                    <strong style={styles.animalName}>{animal.nome}</strong>
                    <p style={styles.animalMeta}>
                      {especieLabel[animal.especie]} • {animal.idade} ano(s) •{' '}
                      {statusLabel[animal.status]}
                    </p>
                    {animal.raca && <p style={styles.animalMeta}>Raça: {animal.raca}</p>}
                  </div>
                </div>

                <div style={styles.itemActions}>
                  <button type="button" onClick={() => editarAnimal(animal)} style={styles.editButton}>
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={excluindoId === animal.id}
                    onClick={() => apagarAnimal(animal)}
                    style={styles.deleteButton}
                  >
                    {excluindoId === animal.id ? 'Apagando...' : 'Apagar'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '28px',
  },
  formCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '4px 6px 0 #111',
  },
  sideCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '4px 6px 0 #111',
  },
  listCard: {
    gridColumn: '1 / -1',
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '4px 6px 0 #111',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
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
    gridTemplateColumns: 'repeat(3, 1fr)',
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
  textarea: {
    minHeight: '72px',
    padding: '10px 12px',
    border: '1px solid #aab2bd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
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
  photoBox: {
    marginTop: '20px',
    height: '150px',
    border: '1px solid #aab2bd',
    borderRadius: '4px',
    display: 'grid',
    placeItems: 'center',
    color: '#667085',
    backgroundColor: '#f5f7f6',
    cursor: 'grab',
    overflow: 'hidden',
    userSelect: 'none',
    touchAction: 'none',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    pointerEvents: 'none',
  },
  photoHelp: {
    margin: '10px 0 0',
    color: '#667085',
    fontSize: '13px',
    lineHeight: 1.4,
  },
  photoControls: {
    marginTop: '12px',
    display: 'grid',
    gap: '10px',
  },
  rangeLabel: {
    display: 'grid',
    gap: '5px',
    color: '#2f3b4d',
    fontSize: '13px',
    fontWeight: 600,
  },
  rangeInput: {
    width: '100%',
    accentColor: '#2e7d32',
    cursor: 'pointer',
  },
  photoButton: {
    width: '100%',
    marginTop: '12px',
    padding: '10px 14px',
    border: '1px solid #9ccc9c',
    borderRadius: '6px',
    background: '#e8f5e9',
    color: '#2e7d32',
    fontWeight: 700,
    cursor: 'pointer',
  },
  statusText: {
    color: '#667085',
  },
  fileInput: {
    display: 'none',
  },
  reloadButton: {
    padding: '9px 14px',
    border: 'none',
    borderRadius: '6px',
    background: '#2e7d32',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  animalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  animalItem: {
    padding: '14px',
    border: '1px solid #d5dbe2',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  animalSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  thumbnail: {
    width: '68px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #c8d0d8',
  },
  thumbnailPlaceholder: {
    width: '68px',
    height: '56px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '4px',
    border: '1px solid #c8d0d8',
    background: '#f5f7f6',
    color: '#667085',
    fontSize: '13px',
  },
  animalName: {
    color: '#1f2933',
  },
  animalMeta: {
    margin: '4px 0 0',
    color: '#667085',
    fontSize: '14px',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: '8px 12px',
    border: '1px solid #9ccc9c',
    borderRadius: '6px',
    background: '#e8f5e9',
    color: '#2e7d32',
    fontWeight: 700,
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 12px',
    border: '1px solid #ef9a9a',
    borderRadius: '6px',
    background: '#ffebee',
    color: '#c62828',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
