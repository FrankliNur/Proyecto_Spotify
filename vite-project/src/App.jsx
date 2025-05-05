import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GenrePage from './pages/GenrePage';
import ArtistPage from './pages/ArtistPage'; // Importación añadida

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/genre/:id" element={<GenrePage />} />
      <Route path="/artist/:id" element={<ArtistPage />} />
    </Routes>
  );
}

export default App;