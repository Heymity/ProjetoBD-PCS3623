import './style.css'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  // Dados fictícios para exibição
  const jogos = [
    {
      id: 1,
      nome: 'Jogo 1',
      rating: 4.5,
      genero: 'RPG',
      membros: 1200,
      imagem: 'src/assets/jogo2.png',
    },
    {
      id: 2,
      nome: 'Jogo 2',
      rating: 4.0,
      genero: 'FPS',
      membros: 800,
      imagem: 'http://feierabendbier.ddns.net:3000/imageFromId/39',
    },
    
    // Adicione mais jogos conforme necessário
  ]

  const usuario = {
    nome: 'CaveiraSuperManeira',
    descricao: 'Eu sou maneiro e não tenho carne. Amo CS 1.6 e sou boomer.',
    imagemPerfil: 'src/assets/perfil.png',
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Gênero</h2>
        <ul>
          <li>FPS</li>
          <li>RPG</li>
          <li>MOBA</li>
          <li>Roguelike</li>
          <li>Indie</li>
        </ul>
        <h2>Rating</h2>
        <input placeholder="> ou < valor..." type="text" />
        <h2>Release Date</h2>
        <input placeholder="> ou < dd/mm/yyyy" type="text" />
        <h2>Popularidade</h2>
        <input placeholder="> ou < valor..." type="text" />
      </div>

      <div className="main-content">
        <div className="search-bar">
          <input placeholder="Pesquisar nome do jogo..." type="text" />
          <input placeholder="Pesquisar estúdio/produtora..." type="text" />
        </div>
        <div className="games-list">
            {jogos.map((jogo) => (
                <div
                key={jogo.id}
                className="game-card"
                onClick={() => navigate(`/jogo/${jogo.id}`)}
                >
                <img src={jogo.imagem} alt={jogo.nome} />
                <h2><strong>{jogo.nome}</strong> </h2>
                <p><strong>Rating:</strong> {jogo.rating}</p>
                <p><strong>Gênero:</strong> {jogo.genero}</p>
                <p><strong>Membros:</strong> {jogo.membros}</p>
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
  )
}

export default Home