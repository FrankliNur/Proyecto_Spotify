import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { BsPersonFill, BsArrowLeft } from 'react-icons/bs';
import { getArtistsByGenre } from '../services/publicApi';

const GenrePage = () => {
  const { id } = useParams();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getArtistsByGenre(id);
        setArtists(data);
      } catch (err) {
        setError('Error al cargar artistas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
          <div className="mt-3">
            <Link to="/" className="btn btn-primary">
              <BsArrowLeft className="me-1" /> Volver
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          <BsArrowLeft className="me-1" /> Géneros
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Artistas</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">Artistas</h1>

      <Row xs={1} md={2} lg={3} className="g-4">
        {artists.map((artist) => (
          <Col key={artist.id}>
            <Card className="h-100 shadow-sm">
              <div className="ratio ratio-1x1">
                {artist.imagen ? (
                  <Image
                    src={`http://localhost:3000${artist.imagen}`}
                    alt={artist.nombre}
                    className="object-fit-cover"
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light text-secondary">
                    <BsPersonFill size={48} />
                  </div>
                )}
              </div>
              <Card.Body className="text-center">
                <Card.Title>{artist.nombre}</Card.Title>
                <Link 
                  to={`/artist/${artist.id}`} 
                  className="btn btn-outline-primary"
                >
                  Ver discografía
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GenrePage;