import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const AlbumList = () => {
  const [albumes, setAlbumes] = useState([]);

  const fetchAlbumes = () => {
    axios.get('http://localhost:3000/albums')
      .then((res) => setAlbumes(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAlbumes();
  }, []);

  const eliminarAlbum = (id) => {
    if (!window.confirm("¿Eliminar álbum?")) return;
    axios.delete(`http://localhost:3000/albums/${id}`)
      .then(() => fetchAlbumes())
      .catch((err) => console.log(err));
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Lista de Álbumes</h4>
              <Link to="/albumes/create" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-circle"></i> Crear Álbum
              </Link>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Portada</th>
                    <th>Nombre</th>
                    <th>Artista</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {albumes.map((album) => (
                    <tr key={album.id}>
                      <td>{album.id}</td>
                      <td>
                        {album.imagen && (
                          <Image
                            src={`http://localhost:3000${album.imagen}`}
                            thumbnail
                            width={60}
                            height={60}
                            alt={`Portada de ${album.nombre}`}
                            className="img-thumbnail"
                          />
                        )}
                      </td>
                      <td>{album.nombre}</td>
                      <td>
                        <Badge bg="info">
                          {album.artista?.nombre || `Artista ID: ${album.artistaId}`}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/albumes/${album.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-pencil-square"></i> Editar
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => eliminarAlbum(album.id)}
                          >
                            <i className="bi bi-trash"></i> Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AlbumList;