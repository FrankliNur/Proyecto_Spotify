import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Image, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const ArtistaList = () => {
    const [artistas, setArtistas] = useState([]);

    const fetchArtistas = () => {
        axios.get('http://localhost:3000/artistas')
            .then((res) => {
                setArtistas(res.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchArtistas();
    }, []);

    const eliminarArtista = (id) => {
        if (!window.confirm("¿Eliminar artista?")) return;
        axios.delete(`http://localhost:3000/artistas/${id}`)
            .then(() => fetchArtistas())
            .catch((err) => console.log(err));
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Género</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artistas.map((artista) => (
                                        <tr key={artista.id}>
                                            <td>{artista.id}</td>
                                            <td>
                                                {artista.imagen && (
                                                    <Image 
                                                        src={`http://localhost:3000${artista.imagen}`} 
                                                        thumbnail 
                                                        width={50}
                                                        height={50}
                                                    />
                                                )}
                                            </td>
                                            <td>{artista.nombre}</td>
                                            <td>
                                                <Badge bg="info">
                                                    {artista.genero?.nombre || "Sin género"}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link 
                                                        to={`/artistas/${artista.id}`} 
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => eliminarArtista(artista.id)}
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
                </Col>
            </Row>
        </Container>
    );
};

export default ArtistaList;