import './style.css';
import { useState, useEffect } from 'react';

function Adicionar_Jogo() {
  const [nome, setNome] = useState('');
  const [estudio, setEstudio] = useState('');
  const [genero, setGenero] = useState('');
  const [dataLancamento, setDataLancamento] = useState('');
  const [imagem, setImagem] = useState(null);
  const [membros, setMembros] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [generosExistentes, setGenerosExistentes] = useState([]);
  const [estudiosExistentes, setEstudiosExistentes] = useState([]);
  const [novoEstudio, setNovoEstudio] = useState('');
  const [imagemEstudio, setImagemEstudio] = useState(null); // Novo estado para a imagem do estúdio

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseGeneros = await fetch('http://feierabendbier.ddns.net:3000/genero');
        if (!responseGeneros.ok) {
          throw new Error('Erro ao buscar gêneros.');
        }
        const generos = await responseGeneros.json();
        setGenerosExistentes(generos);

        const responseEstudios = await fetch('http://feierabendbier.ddns.net:3000/estudio');
        if (!responseEstudios.ok) {
          throw new Error('Erro ao buscar estúdios.');
        }
        const estudios = await responseEstudios.json();
        setEstudiosExistentes(estudios);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('generoId', genero);
    formData.append('name', nome);
    formData.append('studioId', estudio);
    formData.append('releaseDate', dataLancamento);
    formData.append('players', membros);
    formData.append('description', descricao);
    formData.append('file', imagem);

    try {
      const response = await fetch('http://feierabendbier.ddns.net:3000/jogo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar o jogo.');
      }

      alert('Jogo adicionado com sucesso!');
      setNome('');
      setEstudio('');
      setGenero('');
      setDataLancamento('');
      setImagem(null);
      setMembros(0);
      setDescricao('');
    } catch (error) {
      console.error('Erro ao adicionar o jogo:', error);
      alert('Erro ao adicionar o jogo. Tente novamente.');
    }
  };

  const handleCreateStudio = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', novoEstudio);
    formData.append('file', imagemEstudio); // Adiciona a imagem do estúdio

    try {
      const response = await fetch('http://feierabendbier.ddns.net:3000/estudio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao criar estúdio.');
      }

      alert('Estúdio criado com sucesso!');
      setNovoEstudio('');
      setImagemEstudio(null);
      const updatedEstudios = await fetch('http://feierabendbier.ddns.net:3000/estudio');
      const estudios = await updatedEstudios.json();
      setEstudiosExistentes(estudios);
    } catch (error) {
      console.error('Erro ao criar estúdio:', error);
      alert('Erro ao criar estúdio. Tente novamente.');
    }
  };

  return (
    <div className="adicionar-jogo-container">
      <form onSubmit={handleSubmit}>
        <h1>Adicionar Jogo</h1>
        <input
          type="text"
          placeholder="Nome do Jogo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <select
          value={estudio}
          onChange={(e) => setEstudio(e.target.value)}
          required
        >
          <option value="">Selecione um Estúdio</option>
          {estudiosExistentes.map((estudio) => (
            <option key={estudio.ID_ESTÚDIO} value={estudio.ID_ESTÚDIO}>
              {estudio.NOME}
            </option>
          ))}
        </select>
        <select
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          required
        >
          <option value="">Selecione um Gênero</option>
          {generosExistentes.map((genero) => (
            <option key={genero.ID_GÊNERO} value={genero.ID_GÊNERO}>
              {genero.NOME}
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Data de Lançamento"
          value={dataLancamento}
          onChange={(e) => setDataLancamento(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Número de Membros"
          value={membros}
          onChange={(e) => setMembros(e.target.value)}
          min="0"
          required
        />
        <textarea
          placeholder="Descrição do Jogo"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows="5"
          required
        ></textarea>
        <input
          type="file"
          onChange={(e) => setImagem(e.target.files[0])}
          required
        />
        <button type="submit">Adicionar Jogo</button>
      </form>

      <form onSubmit={handleCreateStudio}>
        <h1>Criar Estúdio</h1>
        <input
          type="text"
          placeholder="Nome do Estúdio"
          value={novoEstudio}
          onChange={(e) => setNovoEstudio(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImagemEstudio(e.target.files[0])} // Campo para a imagem do estúdio
          required
        />
        <button type="submit">Criar Estúdio</button>
      </form>
    </div>
  );
}

export default Adicionar_Jogo;