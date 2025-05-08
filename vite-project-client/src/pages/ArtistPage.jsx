import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Spinner, Alert, Breadcrumb, ListGroup } from 'react-bootstrap';
import { BsArrowLeft, BsDiscFill, BsMusicPlayerFill } from 'react-icons/bs';
import axios from 'axios';

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener artista
        const artistResponse = await axios.get(`http://localhost:3000/artistas/${id}`);
        setArtist(artistResponse.data);
        
        // 2. Obtener álbumes del artista
        const albumsResponse = await axios.get(`http://localhost:3000/albums/by-artista/${id}`);
        
        // 3. Obtener TODAS las canciones primero
        const allSongsResponse = await axios.get(`http://localhost:3000/api/canciones`);
        const allSongs = allSongsResponse.data;

        // 4. Filtrar canciones por albumId manualmente
        const albumsWithFilteredSongs = albumsResponse.data.map(album => {
          return {
            ...album,
            canciones: allSongs.filter(song => song.albumId === album.id)
          };
        });
        
        setAlbums(albumsWithFilteredSongs);
      } catch (err) {
        setError('Error al cargar los datos del artista');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="grow" variant="primary" style={{ width: '3rem', height: '3rem' }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center shadow">
          <h4>{error}</h4>
          <div className="mt-3">
            <Link to="/" className="btn btn-danger">
              <BsArrowLeft className="me-2" /> Volver al inicio
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          <BsArrowLeft className="me-2" /> Géneros
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/genre/${artist?.genero?.id}` }}>
          {artist?.genero?.nombre || 'Género'}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{artist?.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Cabecera del artista */}
      <div className="artist-header d-flex flex-column flex-md-row align-items-center mb-5 p-4 bg-dark text-white rounded-3">
        {/* ... (mantén tu código actual de cabecera del artista) */}
      </div>

      {/* Álbumes y canciones - Parte modificada */}
      <h2 className="mb-4 pb-2 border-bottom">
        <BsDiscFill className="me-3" />
        Álbumes
      </h2>
      
      {albums.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay álbumes disponibles para este artista
        </Alert>
      ) : (
        <Row className="g-4">
          {albums.map((album) => (
            <Col key={album.id} xs={12}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    {album.imagen && (
                      <Image
                        src={`http://localhost:3000${album.imagen}`}
                        rounded
                        style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }}
                      />
                    )}
                    <Card.Title>{album.nombre}</Card.Title>
                  </div>

                  {/* Lista de canciones - Estilo similar a tu ejemplo funcional */}
                  <h6>Canciones:</h6>
                  <ListGroup variant="flush">
                    {album.canciones && album.canciones.length > 0 ? (
                      album.canciones.map((cancion) => (
                        <ListGroup.Item key={cancion.id} className="d-flex justify-content-between align-items-center">
                          <span>{cancion.nombre}</span>
                          <audio controls src={`http://localhost:3000${cancion.archivo}`}>
                            Tu navegador no soporta audio.
                          </audio>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>No hay canciones en este álbum</ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ArtistPage;