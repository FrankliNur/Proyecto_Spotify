import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Table, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const CancionList = () => {
  const [canciones, setCanciones] = useState([]);

  const fetchCanciones = () => {
    axios.get('http://localhost:3000/api/canciones')
      .then(res => setCanciones(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => fetchCanciones(), []);

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar canción?")) return;
    axios.delete(`http://localhost:3000/api/canciones/${id}`)
      .then(() => fetchCanciones())
      .catch(err => console.error(err));
  };

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Mis Canciones</h4>
          <Link to="/canciones/create" className="btn btn-primary btn-sm">
            + Nueva Canción
          </Link>
        </Card.Header>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Álbum</th>
                <th>Audio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canciones.map(c => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>
                    <Badge bg="info">
                      {c.album?.nombre || `Álbum ID: ${c.albumId}`}
                    </Badge>
                  </td>
                  <td>
                    <audio controls src={`http://localhost:3000${c.archivo}`}>
                      Tu navegador no soporta audio.
                    </audio>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link 
                        to={`/canciones/${c.id}`}
                        className="btn btn-sm btn-warning"
                      >
                        Editar
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CancionList;