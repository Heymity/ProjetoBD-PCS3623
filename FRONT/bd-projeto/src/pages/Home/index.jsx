import { use } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'


function Home() {

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [existingGenres, setExistingGenres] = useState([]);

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setSelectedGenres((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((genre) => genre !== value)
    );
  };

  const [jogos, setJogos] = useState([]);
  const [ratingmenorque, setRatingMenorque] = useState(0);
  const [ratingmaiorque, setRatingMaiorque] = useState(0);
  const [datamenorque, setDataMenorque] = useState("");
  const [datamaiorque, setDataMaiorque] = useState("");
  const [popularidademenorque, setPopularidadeMenorque] = useState(0);
  const [popularidademaiorque, setPopularidadeMaiorque] = useState(0);
  const [nomeestudio, setNomeEstudio] = useState("");
  const [nomejogo, setNomeJogo] = useState("");
  const [user, setUser] = useState({});

  const navigate = useNavigate()
  useEffect(() => {
    console.log(selectedGenres);
    const fetchData = async () => {
      try {
        let response = await fetch('http://feierabendbier.ddns.net:3000/genero')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const generos = await response.json()
        setExistingGenres(generos);
        response = await fetch('http://feierabendbier.ddns.net:3000/jogo/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "ratingTo": ratingmenorque,
            "ratingFrom": ratingmaiorque,
            "releaseDateTo": datamenorque,
            "releaseDateFrom": datamaiorque,
            "popularityTo": popularidademenorque,
            "popularityFrom": popularidademaiorque,
            "name": nomejogo,
            "studioName": nomeestudio,
            "gendersId": selectedGenres.map((genero) => parseInt(genero))
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        console.log(generos);
        data.map((jogo) => {
          jogo.imagem = `http://feierabendbier.ddns.net:3000/imageFromId/${jogo.ID_FOTO}`;
          jogo.genero = (generos.find((genero) => genero.ID_GÊNERO === jogo.ID_GÊNERO) || {NOME:"Sem gênero"}).NOME;
        })
        setJogos(data);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };
  


    fetchData();
  }, [
    ratingmenorque,
    ratingmaiorque,
    datamenorque,
    datamaiorque,
    popularidademenorque,
    popularidademaiorque,
    nomejogo,
    nomeestudio,
    selectedGenres
  ]);

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
  
  const usuario = {
    nome: 'CaveiraSuperManeira',
    descricao: 'Eu sou maneiro e não tenho carne. Amo CS 1.6 e sou boomer.',
    imagemPerfil: 'src/assets/perfil.png',
  }
  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Gênero</h2>
        <div className="genre-checkboxes">
          {existingGenres.map((genero) => (
            <label key={genero.ID_GÊNERO}>
              <input type="checkbox" value={genero.ID_GÊNERO} onChange={handleGenreChange}/>
              <span>{genero.NOME}</span>
            </label>
          ))}
        </div>
        <h2>Rating</h2>
        <div>
          <input id="ratingmaiorque" onChange={e => setRatingMaiorque(e.target.value)} placeholder=">" type="text" />
          <input id="ratingmenorque" onChange={e => setRatingMenorque(e.target.value)} placeholder="<" type="text" />
        </div>
        <h2>Release Date</h2>
        <div>
          <input id="datamaiorque" onChange={e => setDataMaiorque(e.target.value)} placeholder=">" type="text" />
          <input id="datamenorque" onChange={e => setDataMenorque(e.target.value)} placeholder="<" type="text" />
        </div>
        <h2>Popularidade</h2>
        <div>
          <input id="popularidademaiorque" onChange={e => setPopularidadeMaiorque(e.target.value)} placeholder=">" type="text" />
          <input id="popularidademenorque" onChange={e => setPopularidadeMenorque(e.target.value)} placeholder="<" type="text" />
        </div>
      </div>

      <div className="main-content">
        <div className="search-bar">
          <input onChange={e => setNomeJogo(e.target.value)} placeholder="Pesquisar nome do jogo..." type="text" />
          <input onChange={e => setNomeEstudio(e.target.value)} placeholder="Pesquisar estúdio/produtora..." type="text" />
        </div>
        <div className="games-list">
            {jogos.map((jogo) => (
                <div
                key={jogo.ID_JOGO}
                className="game-card"
                onClick={() => navigate(`/jogo/${jogo.ID_JOGO}`)}
                >
                  <img src={jogo.imagem} alt={jogo.nome} />
                  <h2><strong>{jogo.NOME}</strong> </h2>
                  <p><strong>Rating:</strong> {jogo.NOTA}</p>
                  <p><strong>Gênero:</strong> {jogo.genero}</p>
                  <p><strong>Membros:</strong> {jogo.MEMBROS}</p>
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
  )
}

export default Home