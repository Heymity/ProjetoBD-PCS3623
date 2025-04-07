import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import perfil from '../../assets/perfil.png'; // Imagem do perfil
import jogo2 from '../../assets/jogo2.png'; // Imagem de exemplo de jogo

function Perfil_Usuario() {
  const { nome } = useParams(); // Obtém o nome do usuário da URL
  const navigate = useNavigate();

  // Dados fictícios para exibição
  const usuario = {
    nome,
    descricao: 'Eu sou maneiro e não tenho carne. Amo CS 1.6 e sou boomer.',
    imagemPerfil: perfil,
    avaliacoes: [
      {
        texto: 'Jogo incrível, gráficos lindos e ótima jogabilidade!',
        nota: 9.5,
        jogo: {
          nome: 'Jogo Exemplo 1',
          imagem: jogo2,
        },
      },
      {
        texto: 'Achei o jogo repetitivo, mas ainda assim divertido.',
        nota: 7.0,
        jogo: {
          nome: 'Jogo Exemplo 2',
          imagem: jogo2,
        },
      },
    ],
  };

  return (
    <div className="perfil-container">
      <div className="perfil-content">
        <img src={usuario.imagemPerfil} alt="Perfil" />
        <h1>{usuario.nome}</h1>
        <p>{usuario.descricao}</p>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>

      <div className="avaliacoes-list">
        {usuario.avaliacoes.map((avaliacao, index) => (
          <div
            key={index}
            className="avaliacao-card"
            onClick={() => navigate(`/jogo/${avaliacao.jogo.nome}`)} // Redireciona para a página do jogo
            style={{ cursor: 'pointer' }} // Adiciona um cursor de "mão" para indicar que é clicável
          >
            <img src={avaliacao.jogo.imagem} alt={avaliacao.jogo.nome} />
            <div>
              <h3>{avaliacao.jogo.nome}</h3>
              <p><strong>Nota:</strong> {avaliacao.nota}/10</p>
              <p>{avaliacao.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Perfil_Usuario;