import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Image, Alert, FormSelect } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormArtista = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [generoId, setGeneroId] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenPrevia, setImagenPrevia] = useState('');
    const [generos, setGeneros] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Carga géneros para el dropdown
        axios.get('http://localhost:3000/generos')
            .then((res) => setGeneros(res.data))
            .catch((err) => console.log(err));

        if (id) {
            // Carga datos del artista si está en modo edición
            axios.get(`http://localhost:3000/artistas/${id}`)
                .then((res) => {
                    setNombre(res.data.nombre);
                    setGeneroId(res.data.generoId);
                    if (res.data.imagen) {
                        setImagenPrevia(`http://localhost:3000${res.data.imagen}`);
                    }
                }).catch((err) => setError("Error al cargar artista"));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('generoId', generoId);
        if (imagen) formData.append('imagen', imagen);

        try {
            if (id) {
                await axios.put(`http://localhost:3000/artistas/${id}`, formData);
            } else {
                await axios.post('http://localhost:3000/artistas', formData);
            }
            navigate('/artistas');
        } catch (err) {
            setError(err.response?.data?.error || "Error al guardar");
        }
    };

    return (
        <Container className="mt-3">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">
                            {id ? 'Editar Artista' : 'Crear Artista'}
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
                                    <Form.Label>Género</Form.Label>
                                    <Form.Select
                                        value={generoId}
                                        onChange={(e) => setGeneroId(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar género</option>
                                        {generos.map((genero) => (
                                            <option key={genero.id} value={genero.id}>
                                                {genero.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Imagen (Opcional)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setImagen(file);
                                            setImagenPrevia(URL.createObjectURL(file));
                                        }}
                                    />
                                    {imagenPrevia && (
                                        <Image
                                            src={imagenPrevia}
                                            thumbnail
                                            className="mt-2"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    )}
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    {id ? 'Actualizar' : 'Guardar'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormArtista;