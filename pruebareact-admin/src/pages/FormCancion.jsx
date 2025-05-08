import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, FormSelect } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormCancion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [albumes, setAlbumes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3000/albums')
      .then(res => setAlbumes(res.data))
      .catch(err => console.error(err));

    if (id) {
      axios.get(`http://localhost:3000/api/canciones/${id}`)
        .then(res => {
          setNombre(res.data.nombre);
          setAlbumId(res.data.albumId);
        })
        .catch(err => setError("Error al cargar canción"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('albumId', albumId);
    if (archivo) formData.append('archivo', archivo);

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/canciones/${id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/canciones/create', formData);
      }
      navigate("/canciones");
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar");
    }
  };

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header>
          <h4>{id ? 'Editar Canción' : 'Nueva Canción'}</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Álbum</Form.Label>
              <Form.Select
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                required
              >
                <option value="">Seleccionar álbum</option>
                {albumes.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Archivo MP3 {!id ? '' : '(Opcional)'}</Form.Label>
              <Form.Control
                type="file"
                accept=".mp3"
                onChange={(e) => setArchivo(e.target.files[0])}
                required={!id}
              />
              <Form.Text className="text-muted">
                Solo archivos MP3. Máx. 10MB.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                {id ? 'Actualizar' : 'Guardar'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate("/canciones")}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormCancion;