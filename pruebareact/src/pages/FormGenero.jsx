import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Image, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormGenero = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenPrevia, setImagenPrevia] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchGeneroInfo();
    }, [id]);

    const fetchGeneroInfo = () => {
        axios.get(`http://localhost:3000/generos/${id}`)
            .then((res) => {
                setNombre(res.data.nombre);
                if (res.data.imagen) {
                    setImagenPrevia(`http://localhost:3000${res.data.imagen}`);
                }
            }).catch((err) => {
                console.log(err);
                setError('No se pudo cargar el género');
            });
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { // 5MB máximo
            setError('La imagen es demasiado grande (máximo 5MB)');
            return;
        }
        setImagen(file);
        setImagenPrevia(URL.createObjectURL(file));
        setError('');
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!nombre) {
            setError('El nombre es requerido');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        try {
            if (id) {
                await axios.put(`http://localhost:3000/generos/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:3000/generos', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            navigate('/');
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Error al guardar el género');
        }
    };

    return (
        <Container className="mt-3">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">
                                {id ? 'Editar Género' : 'Crear Nuevo Género'}
                            </h4>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            <Form onSubmit={onFormSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Género</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                        placeholder="Ej: Rock, Pop, Jazz..."
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Imagen Representativa {!id && '(Opcional)'}
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImagenChange}
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
                                                className="img-fluid"
                                                alt="Vista previa de la imagen"
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                                
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        size="lg"
                                    >
                                        {id ? 'Actualizar Género' : 'Crear Género'}
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate('/')}
                                    >
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

export default FormGenero;