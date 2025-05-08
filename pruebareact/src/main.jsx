import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GeneroList from './pages/GeneroList.jsx';  // Cambiado
import FormGenero from './pages/FormGenero.jsx';  // Cambiado
import Menu from './components/Menu';
import ArtistaList from './pages/ArtistaList.jsx';  // Nuevo
import FormArtista from './pages/FormArtista.jsx';  // Nuevo
import AlbumList from './pages/AlbumList';
import FormAlbum from './pages/FormAlbum';
import CancionList from './pages/CancionList.jsx';
import FormCancion from './pages/FormCancion.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<GeneroList />} />
        <Route path="/generos/create" element={<FormGenero />} />  {/* Cambiado */}
        <Route path="/generos/:id" element={<FormGenero />} />     {/* Cambiado */}

        <Route path="/artistas" element={<ArtistaList />} />
        <Route path="/artistas/create" element={<FormArtista />} />
        <Route path="/artistas/:id" element={<FormArtista />} />

        <Route path="/albumes" element={<AlbumList />} />
        <Route path="/albumes/create" element={<FormAlbum />} />
        <Route path="/albumes/:id" element={<FormAlbum />} />

        <Route path="/canciones" element={<CancionList />} />
        <Route path="/canciones/create" element={<FormCancion />} />
        <Route path="/canciones/:id" element={<FormCancion />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);