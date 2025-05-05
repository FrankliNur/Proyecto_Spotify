import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Spinner, Alert, Breadcrumb, ListGroup } from 'react-bootstrap';
import { BsArrowLeft, BsDiscFill, BsMusicPlayerFill, BsPlayFill } from 'react-icons/bs';
import { getArtistById, getAlbumsByArtist } from '../services/publicApi';

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlbum, setExpandedAlbum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistData = await getArtistById(id);
        const albumsData = await getAlbumsByArtist(id);
        
        setArtist(artistData);
        setAlbums(albumsData);
      } catch (err) {
        setError('Error al cargar el artista');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleAlbum = (albumId) => {
    setExpandedAlbum(expandedAlbum === albumId ? null : albumId);
  };

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

      <div className="artist-header d-flex flex-column flex-md-row align-items-center mb-5 p-4 bg-dark text-white rounded-3">
        <div className="artist-avatar mb-3 mb-md-0 me-md-4">
          {artist?.imagen ? (
            <Image 
              src={`http://localhost:3000${artist.imagen}`}
              roundedCircle
              className="border border-4 border-white"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          ) : (
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" 
              style={{ width: '150px', height: '150px' }}>
              <BsMusicPlayerFill size={60} className="text-light" />
            </div>
          )}
        </div>
        <div className="artist-info text-center text-md-start">
          <h1 className="display-5 fw-bold mb-2">{artist?.nombre}</h1>
          <p className="lead mb-0">
            <span className="badge bg-primary fs-6">{artist?.genero?.nombre}</span>
          </p>
        </div>
      </div>

      <h2 className="mb-4 pb-2 border-bottom">
        <BsDiscFill className="me-3" />
        Álbumes y Canciones
      </h2>
      
      {albums.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay álbumes disponibles para este artista
        </Alert>
      ) : (
        <Row className="g-4">
          {albums.map((album) => (
            <Col key={album.id} xs={12} md={6} lg={4}>
              <Card className="shadow-sm">
                <div className="d-flex">
                  <div className="album-cover" style={{ width: '120px', height: '120px' }}>
                    {album.imagen ? (
                      <Image
                        src={`http://localhost:3000${album.imagen}`}
                        alt={`Portada de ${album.nombre}`}
                        className="h-100 object-fit-cover rounded-start"
                      />
                    ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center bg-light text-secondary rounded-start">
                        <BsDiscFill size={48} />
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title>{album.nombre}</Card.Title>
                    <button 
                      onClick={() => toggleAlbum(album.id)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      {expandedAlbum === album.id ? 'Ocultar canciones' : 'Mostrar canciones'}
                    </button>
                    
                    {expandedAlbum === album.id && (
                      <ListGroup variant="flush" className="mt-3">
                        {album.canciones?.length > 0 ? (
                          album.canciones.map((cancion) => (
                            <ListGroup.Item key={cancion.id} className="d-flex justify-content-between align-items-center">
                              <span>{cancion.nombre}</span>
                              <audio controls className="ms-3">
                                <source src={`http://localhost:3000${cancion.archivo}`} type="audio/mpeg" />
                                Tu navegador no soporta el elemento de audio.
                              </audio>
                            </ListGroup.Item>
                          ))
                        ) : (
                          <ListGroup.Item>No hay canciones en este álbum</ListGroup.Item>
                        )}
                      </ListGroup>
                    )}
                  </Card.Body>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ArtistPage;