import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Alert, FormSelect, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormAlbum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [artistaId, setArtistaId] = useState("");
  const [artistas, setArtistas] = useState([]);
  const [error, setError] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenPrevia, setImagenPrevia] = useState("");

  useEffect(() => {
    // Cargar lista de artistas para el dropdown
    axios.get('http://localhost:3000/artistas')
      .then((res) => setArtistas(res.data))
      .catch((err) => console.log(err));

    if (id) {
      // Cargar datos del álbum si está en modo edición
      axios.get(`http://localhost:3000/albums/${id}`)
        .then((res) => {
          setNombre(res.data.nombre);
          setArtistaId(res.data.artistaId);
          if (res.data.imagen) {
            setImagenPrevia(`http://localhost:3000${res.data.imagen}`);
          }
        })
        .catch((err) => setError("Error al cargar el álbum"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !artistaId) {
      setError("Nombre y artista son requeridos");
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('artistaId', artistaId);
    if (imagen) formData.append('imagen', imagen);

    try {
      if (id) {
        await axios.put(`http://localhost:3000/albums/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://localhost:3000/albums', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate("/albumes");
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar el álbum");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError("La imagen no debe superar 5MB");
        return;
      }
      setImagen(file);
      setImagenPrevia(URL.createObjectURL(file));
      setError("");
    }
  };

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">{id ? 'Editar Álbum' : 'Crear Álbum'}</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Álbum</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Ej: Thriller, The Dark Side of the Moon"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Artista</Form.Label>
                  <Form.Select
                    value={artistaId}
                    onChange={(e) => setArtistaId(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar artista</option>
                    {artistas.map((artista) => (
                      <option key={artista.id} value={artista.id}>
                        {artista.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Portada {!id && '(Opcional)'}</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Tamaño máximo: 5MB. Formatos: JPG, PNG, GIF
                  </Form.Text>

                  {imagenPrevia && (
                    <div className="mt-3 text-center">
                      <Image
                        src={imagenPrevia}
                        thumbnail
                        style={{ maxHeight: '200px' }}
                        alt="Vista previa de la portada"
                      />
                    </div>
                  )}
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg">
                    {id ? 'Actualizar Álbum' : 'Crear Álbum'}
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate("/albumes")}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormAlbum;