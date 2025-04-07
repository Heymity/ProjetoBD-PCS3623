import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import jogo2 from '../../assets/jogo2.png'; // Imagem do jogo
import perfil from '../../assets/perfil.png'; // Imagem do perfil

function Avaliacao() {
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
    imagem: jogo2,
  };

  const usuario = {
    nome: 'CaveiraSuperManeira',
    descricao: 'Eu sou maneiro e não tenho carne. Amo CS 1.6 e sou boomer.',
    imagemPerfil: perfil,
  };

  const handleEnviar = () => {
    alert('Avaliação enviada com sucesso!');
    navigate(`/jogo/${jogo.id}`);
  };

  return (
    <div className="avaliacao-container">
      <div className="sidebar">
        <img src={jogo.imagem} alt={jogo.nome} />
        <h2>{jogo.nome}</h2>
        <p><strong>Rating:</strong> {jogo.rating}</p>
        <p><strong>Gêneros:</strong> {jogo.genero}</p>
        <p><strong>Release Date:</strong> {jogo.releaseDate}</p>
        <p><strong>Estúdio:</strong> {jogo.estudio}</p>
        <p><strong>Membros:</strong> {jogo.membros}</p>
        <button onClick={() => navigate(`/jogo/${jogo.id}`)}>Voltar</button>
      </div>

      <div className="main-content">
        <textarea placeholder="Escreva sua avaliação..." rows="10"></textarea>
        <input type="number" placeholder="Nota (0 a 10)" min="0" max="10" />
        <button onClick={handleEnviar}>Enviar Avaliação</button>
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

export default Avaliacao;