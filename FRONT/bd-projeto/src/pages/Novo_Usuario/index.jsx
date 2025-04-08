import './style.css'
import { useNavigate } from 'react-router-dom'

function Novo_Usuario() {
  const navigate = useNavigate()
  async function sendLogin(formData) {
    const response = await fetch('http://feierabendbier.ddns.net:3000/user/logon', {
      method: 'POST',
      body: formData
    })
    if (response.ok) {
      alert('Usuário cadastrado com sucesso!')
      const data = await response.json()
      localStorage.setItem('token', data.accessToken)
      navigate('/login')
    } else {
      alert('Erro ao cadastrar usuário')
    }
  }
  return (
      <div className='container'>
        <img src='src/assets/mygame.png'></img>
        <form onSubmit ={async (e) => {
          e.preventDefault()
          console.log('submit')
          const form = e.target
          const email = form['E-mail'].value
          const nome = form['Nome'].value
          const imagem = form['Imagem'].files[0]
          const descricao = form['Descricao'].value
          const senha = form['Senha'].value
          
          const formData = new FormData()
          formData.append('email', email)
          formData.append('name', nome)
          formData.append('file', imagem)
          formData.append('description', descricao)
          formData.append('password', senha)
          console.log(formData)
          sendLogin(formData)
        }}>
          <h1>Novo Usuário</h1>
          <input placeholder="Imagem" name="Imagem" type='file'/>
          <input placeholder="E-mail" name="E-mail" type='text'/>
          <input placeholder="Nome" name="Nome" type='text'/>
          <input placeholder="Descrição" name="Descricao" type='text'/>
          <input placeholder="Senha" name="Senha" type='password'/>
          <button type='submit'>Cadastrar Usuário</button>
          <button type='button' onClick={() => navigate('/login')}>Voltar</button>
        </form>
      </div>
  )
}

export default Novo_Usuario