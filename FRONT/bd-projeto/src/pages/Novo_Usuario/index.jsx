import './style.css'
import { useNavigate } from 'react-router-dom'

function Novo_Usuario() {
  const navigate = useNavigate()
  return (
      <div className='container'>
        <img src='src/assets/mygame.png'></img>
        <form>
          <h1>Novo Usuário</h1>
          <input placeholder="E-mail" name="E-mail" type='text'/>
          <input placeholder="Nome" name="Nome" type='text'/>
          <input placeholder="Descrição" name="Descricao" type='text'/>
          <input placeholder="Senha" name="Senha" type='password'/>
          <button type='button'>Cadastrar Usuário</button>
          <button type='button' onClick={() => navigate('/')}>Voltar</button>
        </form>
      </div>
  )
}

export default Novo_Usuario