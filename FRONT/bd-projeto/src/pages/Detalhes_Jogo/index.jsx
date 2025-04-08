import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import jogo2 from '../../assets/jogo2.png'; // Imagem do jogo
import perfil from '../../assets/perfil.png'; // Imagem do perfil
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importa a biblioteca jwt-decode para decodificar o token JWT

function Detalhes_Jogo() {
  const { id } = useParams(); // Obtém o ID do jogo da URL
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [jogo, setJogo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const email = jwtDecode(token).id
        const response = await fetch('http://feierabendbier.ddns.net:3000/user/' + email)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        console.log(data)
        data.imagemPerfil = `http://feierabendbier.ddns.net:3000/imageFromId/${data.ID_FOTO}`
        setUser(data)
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`http://feierabendbier.ddns.net:3000/jogo/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data1 = await response.json();
        const data = data1[0]; // Acessa o primeiro elemento do array retornado
        console.log(data);
        data.ID_FOTO = `http://feierabendbier.ddns.net:3000/imageFromId/${data.ID_FOTO}`;
        response = await fetch(`http://feierabendbier.ddns.net:3000/avaliacao/jogo/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const avaliacoes = await response.json();
        data.avaliacoes = avaliacoes.map((avaliacao) => {
          avaliacao.imagemPerfil = `http://feierabendbier.ddns.net:3000/imageFromId/${avaliacao.ID_FOTO}`; // Atualiza a URL da imagem do perfil
          return avaliacao;
        });
        data.NOME_GÊNERO = data.NOME_GÊNERO || "Sem gênero"; // Define um valor padrão caso o gênero não esteja definido
        data.NOME_ESTUDIO = data.NOME_ESTUDIO || "Sem estúdio"; // Define um valor padrão caso o estúdio não esteja definido
        data.MEMBROS = data.MEMBROS || "Sem membros"; // Define um valor padrão caso os membros não estejam definidos
        data.NOTA = data.NOTA || "Sem nota"; // Define um valor padrão caso a nota não esteja definida
        data.DATA_LANÇAMENTO = data.DATA_LANÇAMENTO || "Sem data"; // Define um valor padrão caso a data não esteja definida
        data.descricao = data.descricao || "Sem descrição"; // Define um valor padrão caso a descrição não esteja definida
        data.avaliacoes = data.avaliacoes || []; // Define um valor padrão caso as avaliações não estejam definidas
        setJogo(data); // Atualiza o estado com os dados do jogo
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    }
    fetchData()
  }, [id])

  return (
    <div className="game-detail-container">
      <div className="sidebar">
        <img src={jogo.ID_FOTO} alt={jogo.NOME} />
        <h2>{jogo.NOME}</h2>
        <p><strong>Rating:</strong> {jogo.NOTA}</p>
        <p><strong>Gêneros:</strong> {jogo.NOME_GÊNERO}</p>
        <p><strong>Release Date:</strong> {new Date(jogo.DATA_LANÇAMENTO).toLocaleDateString('pt-BR')}</p>
        <p><strong>Estúdio:</strong> {jogo.NOME_ESTUDIO}</p>
        <p><strong>Membros:</strong> {jogo.MEMBROS}</p>
        <button onClick={() => navigate(`/avaliar/${id}`)}>Adicionar Avaliação</button>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>

      <div className="main-content">
        <h2>Descrição</h2>
        <p>{jogo.DESCRIÇÃO}</p>
        <h2>Avaliações</h2>
        <div className="avaliacoes-list">
          {jogo.avaliacoes && jogo.avaliacoes.map((avaliacao, index) => (
            <div key={index} className="avaliacao-card">
              <div className="avaliacao-header">
                <img
                  src={avaliacao.imagemPerfil}
                  alt={`Perfil de ${avaliacao.NOME}`}
                  className="avaliacao-perfil"
                  onClick={() => navigate(`/perfil/${avaliacao.NOME}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="avaliacao-info">
                  <h3
                    onClick={() => navigate(`/perfil/${avaliacao.NOME}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {avaliacao.NOME}
                  </h3>
                  <p><strong>Avaliação:</strong> {avaliacao.NOTA}/10</p>
                </div>
              </div>
              <p>{avaliacao.TEXTO}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="user-profile">
        { localStorage.getItem("token") && 
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
      } 
      { !localStorage.getItem("token") &&
        <div>
          <h3>Usuário não logado</h3>
          <button className="button" onClick={() => navigate('/login')}>Login</button>
          <button className="button" onClick={() => navigate('/novo-usuario')}>Novo Usuário</button>
      </div>
      }
      </div>
    </div>
  );
}

export default Detalhes_Jogo;