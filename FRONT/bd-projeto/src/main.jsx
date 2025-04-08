import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import Novo_Usuario from './pages/Novo_Usuario'
import Home from './pages/Home'
import Detalhes_Jogo from './pages/Detalhes_Jogo';
import Avaliacao from './pages/Avaliacao';
import Perfil_Usuario from './pages/Perfil_Usuario';
import Adicionar_Jogo from './pages/Adicionar_Jogo';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/novo-usuario" element={<Novo_Usuario />} />
        <Route path="/" element={<Home />} />
        <Route path="/jogo/:id" element={<Detalhes_Jogo />} />
        <Route path="/avaliar/:id" element={<Avaliacao />} />
        <Route path="/adicionar-jogo" element={<Adicionar_Jogo />} />
        <Route path="/perfil/:nome" element={<Perfil_Usuario />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
