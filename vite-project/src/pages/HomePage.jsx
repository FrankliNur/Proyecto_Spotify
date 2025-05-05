import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGenres } from '../services/publicApi';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { BsMusicNoteList, BsArrowRight } from 'react-icons/bs';

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (err) {
        setError('Error al cargar géneros. Intenta recargar la página.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger text-center">
          {error}
          <button 
            className="btn btn-link" 
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4 display-4">
        <BsMusicNoteList className="me-2" />
        Géneros Musicales
      </h1>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {genres.map((genre) => (
          <Col key={genre.id}>
            <Card className="h-100 shadow-sm hover-effect">
              <div className="ratio ratio-16x9">
                {genre.imagen ? (
                  <Image
                    src={`http://localhost:3000${genre.imagen}`}
                    alt={`Portada de ${genre.nombre}`}
                    className="card-img-top object-fit-cover"
                    thumbnail
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light text-secondary h-100">
                    <BsMusicNoteList size={48} />
                  </div>
                )}
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">{genre.nombre}</Card.Title>
                <Link 
                  to={`/genre/${genre.id}`} 
                  className="btn btn-primary mt-auto align-self-center"
                >
                  Explorar <BsArrowRight className="ms-1" />
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;