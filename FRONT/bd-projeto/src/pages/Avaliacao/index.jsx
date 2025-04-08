import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function Avaliacao() {
  const { id } = useParams(); // Obtém o ID do jogo da URL
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [jogo, setJogo] = useState({});
  const [avaliacao, setAvaliacao] = useState("");
  const [nota, setNota] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = jwtDecode(token).id;
        const response = await fetch('http://feierabendbier.ddns.net:3000/user/' + email);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.imagemPerfil = `http://feierabendbier.ddns.net:3000/imageFromId/${data.ID_FOTO}`;
        setUser(data);
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`http://feierabendbier.ddns.net:3000/jogo/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const game = data[0];
        game.ID_FOTO = `http://feierabendbier.ddns.net:3000/imageFromId/${game.ID_FOTO}`;
        setJogo(game);
      } catch (error) {
        console.error('Erro ao buscar os dados do jogo:', error);
      }
    };
    fetchGameData();
  }, [id]);

  const handleEnviar = async () => {
    if (!avaliacao || nota < 0 || nota > 10) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
    const token = localStorage.getItem('token');
    const response = await fetch('http://feierabendbier.ddns.net:3000/avaliacao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        gameId: jogo.ID_JOGO,
        note: nota,
        text: avaliacao
      }),
    })
    if (!response.ok) {
      alert('Erro ao enviar a avaliação. Tente novamente mais tarde.');
      return;
    }
    const data = await response.json();
    console.log(data);
    alert('Avaliação enviada com sucesso!');
    navigate(`/jogo/${jogo.ID_JOGO}`);
  };

  return (
    <div className="avaliacao-container">
      {/* Barra da esquerda (informações do jogo) */}
      <div className="sidebar">
        <img src={jogo.ID_FOTO} alt={jogo.NOME} />
        <h2>{jogo.NOME}</h2>
        <p><strong>Rating:</strong> {jogo.NOTA}</p>
        <p><strong>Gêneros:</strong> {jogo.NOME_GÊNERO}</p>
        <p><strong>Release Date:</strong> {new Date(jogo.DATA_LANÇAMENTO).toLocaleDateString('pt-BR')}</p>
        <p><strong>Estúdio:</strong> {jogo.NOME_ESTUDIO}</p>
        <p><strong>Membros:</strong> {jogo.MEMBROS}</p>
        <button onClick={() => navigate(`/jogo/${jogo.ID_JOGO}`)}>Voltar</button>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content">
        <textarea onChange={e => setAvaliacao(e.target.value)} placeholder="Escreva sua avaliação..." rows="10"></textarea>
        <input onChange={e => setNota(e.target.value)} type="number" placeholder="Nota (0 a 10)" min="0" max="10" />
        <button onClick={handleEnviar}>Enviar Avaliação</button>
      </div>

      {/* Barra da direita (informações do usuário) */}
      <div className="user-profile">
        {localStorage.getItem('token') && (
          <div>
            <img
              src={user.imagemPerfil}
              alt="Perfil"
              onClick={() => navigate(`/perfil/${user.NOME}`)}
              style={{ cursor: 'pointer' }}
            />
            <h3
              onClick={() => navigate(`/perfil/${user.NOME}`)}
              style={{ cursor: 'pointer' }}
            >
              Usuário: {user.NOME}
            </h3>
            <p>Descrição: {user.DESCRIÇÃO}</p>
            <button
              className="logout-button"
              onClick={() => {
                localStorage.removeItem('token'); // Remove o token do localStorage
                navigate('/login'); // Redireciona para a tela de login
              }}
            >
              Logout
            </button>
          </div>
        )}
        {!localStorage.getItem('token') && (
          <div>
            <h3>Usuário não logado</h3>
            <button className="button" onClick={() => navigate('/login')}>Login</button>
            <button className="button" onClick={() => navigate('/novo-usuario')}>Novo Usuário</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Avaliacao;