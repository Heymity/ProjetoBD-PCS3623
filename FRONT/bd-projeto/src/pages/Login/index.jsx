import { useEffect } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'

function Login() {
  async function sendLogin(email, senha) {
    const response = await fetch('http://feierabendbier.ddns.net:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password: senha })
    })
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('token', data.accessToken)
      navigate('/')
    } else {
      alert('Login ou senha inválidos')
    }
  }
  const navigate = useNavigate()
  return (
      <div className='container'>
        <img src='src/assets/mygame.png'></img>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log('submit')
          const form = e.target
          const email = form['E-mail'].value
          const senha = form['Senha'].value
          sendLogin(email, senha)
        }}>
          <h1>Login</h1>
          <input placeholder="E-mail" name="E-mail" type='text'/>
          <input placeholder="Senha" name="Senha" type='password'/>
          <button type='submit'>Efetuar Login</button>
          <button type='button' onClick={() => navigate('/novo-usuario')}>Novo Usuário</button>
        </form>
      </div>
  )
}

export default Login
