import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import jogo2 from '../../assets/jogo2.png'; // Imagem do jogo
import perfil from '../../assets/perfil.png'; // Imagem do perfil

function Detalhes_Jogo() {
  const { id } = useParams(); // Obtém o ID do jogo da URL
  const navigate = useNavigate();

  // Dados fictícios para exibição
  const jogo = {
    id,
    nome: 'Jogo Exemplo',
    rating: 7.5,
    genero: 'MMO, FPS, Open World',
    releaseDate: '06/09/2017',
    estudio: 'Bungie',
    membros: 714485,
    descricao:
      'B é um action MMO com um mundo evolutivo que você e seus amigos podem explorar a qualquer momento. Mergulhe no universo de B para desvendar mistérios e enfrentar combates intensos.',
    imagem: jogo2,
    avaliacoes: [
      {
        usuario: 'Trolador Maluco',
        nota: 6.9,
        comentario:
          'B é como minha namorada abusiva: roubou meu dinheiro, afastou meus amigos, mas não consigo me separar dela.',
        imagemPerfil: perfil, // Adicione a imagem do perfil
      },
      {
        usuario: 'BigBalls',
        nota: 8.0,
        comentario:
          'B possui gráficos bonitos, história cativante e boa comunidade. Sempre cheio de vida e novidades.',
        imagemPerfil: perfil, // Adicione a imagem do perfil
      },
    ],
  };

  const usuario = {
    nome: 'CaveiraSuperManeira',
    descricao: 'Eu sou maneiro e não tenho carne. Amo CS 1.6 e sou boomer.',
    imagemPerfil: perfil,
  };

  return (
    <div className="game-detail-container">
      <div className="sidebar">
        <img src={jogo.imagem} alt={jogo.nome} />
        <h2>{jogo.nome}</h2>
        <p><strong>Rating:</strong> {jogo.rating}</p>
        <p><strong>Gêneros:</strong> {jogo.genero}</p>
        <p><strong>Release Date:</strong> {jogo.releaseDate}</p>
        <p><strong>Estúdio:</strong> {jogo.estudio}</p>
        <p><strong>Membros:</strong> {jogo.membros}</p>
        <button onClick={() => navigate(`/avaliar/${jogo.id}`)}>Adicionar Avaliação</button>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>

      <div className="main-content">
        <h2>Descrição</h2>
        <p>{jogo.descricao}</p>
        <h2>Avaliações</h2>
        <div className="avaliacoes-list">
          {jogo.avaliacoes.map((avaliacao, index) => (
            <div key={index} className="avaliacao-card">
              <div className="avaliacao-header">
                <img
                  src={avaliacao.imagemPerfil}
                  alt={`Perfil de ${avaliacao.usuario}`}
                  className="avaliacao-perfil"
                  onClick={() => navigate(`/perfil/${avaliacao.usuario}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="avaliacao-info">
                  <h3
                    onClick={() => navigate(`/perfil/${avaliacao.usuario}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {avaliacao.usuario}
                  </h3>
                  <p><strong>Avaliação:</strong> {avaliacao.nota}/10</p>
                </div>
              </div>
              <p>{avaliacao.comentario}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="user-profile">
        <img
          src={usuario.imagemPerfil}
          alt="Perfil"
          onClick={() => navigate(`/perfil/${usuario.nome}`)}
          style={{ cursor: 'pointer' }}
        />
        <h3
          onClick={() => navigate(`/perfil/${usuario.nome}`)}
          style={{ cursor: 'pointer' }}
        >
          Usuário: {usuario.nome}
        </h3>
        <p>Descrição: {usuario.descricao}</p>
      </div>
    </div>
  );
}

export default Detalhes_Jogo;