import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import perfil from '../../assets/perfil.png'; // Imagem do perfil
import jogo2 from '../../assets/jogo2.png'; // Imagem de exemplo de jogo
import { useEffect, useState } from 'react';

function Perfil_Usuario() {
  const { nome } = useParams(); // Obtém o nome do usuário da URL
  const navigate = useNavigate();

  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        let response = await fetch(`http://feierabendbier.ddns.net:3000/user/username/${nome}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.imagem = `http://feierabendbier.ddns.net:3000/imageFromId/${data.ID_FOTO}`; // Atualiza a URL da imagem do usuário
        response = await fetch(`http://feierabendbier.ddns.net:3000/avaliacao/user/${nome}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const avaliacoes = await response.json();
        data.avaliacoes = avaliacoes.map((avaliacao) => {
          avaliacao.imagemjogo = `http://feierabendbier.ddns.net:3000/imageFromId/${avaliacao.ID_FOTO_JOGO}`; // Atualiza a URL da imagem do jogo
          return avaliacao;
        });
        setUser(data); // Atualiza o estado com os dados do usuário
        console.log(data); // Exibe os dados do usuário no console
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    }
    fetchData();
  }, [nome]
  )

  return (
    <div className="perfil-container">
      <div className="perfil-content">
        <img src={user.imagem} alt="Perfil" />
        <h1>{user.NOME}</h1>
        <p>{user.DESCRIÇÃO}</p>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>
      <div className="avaliacoes-list">
        {user.avaliacoes && user.avaliacoes.map((avaliacao, index) => (
          <div
            key={index}
            className="avaliacao-card"
            onClick={() => navigate(`/jogo/${avaliacao.ID_JOGO}`)} // Redireciona para a página do jogo usando o ID
            style={{ cursor: 'pointer' }} // Adiciona um cursor de "mão" para indicar que é clicável
          >
            <img src={avaliacao.imagemjogo} alt={avaliacao.NOME_JOGO} />
            <div>
              <h3>{avaliacao.NOME_JOGO}</h3>
              <p><strong>Nota:</strong> {avaliacao.NOTA}/10</p>
              <p>{avaliacao.TEXTO}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Perfil_Usuario;