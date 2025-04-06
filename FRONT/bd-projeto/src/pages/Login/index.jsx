import './style.css'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  return (
      <div className='container'>
        <img src='src/assets/mygame.png'></img>
        <form>
          <h1>Login</h1>
          <input placeholder="E-mail" name="E-mail" type='text'/>
          <input placeholder="Senha" name="Senha" type='text'/>
          <button type='button'>Efetuar Login</button>
          <button type='button' onClick={() => navigate('/novo-usuario')}>Novo Usuário</button>
        </form>
      </div>
  )
}

export default Login
