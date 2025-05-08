import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const GeneroList = () => {
    const [generoList, setGeneroList] = useState([]);

    const fetchGeneroList = () => {
        axios.get('http://localhost:3000/generos')
            .then((res) => {
                setGeneroList(res.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchGeneroList();
    }, []);

    const eliminarGenero = (id) => {
        const confirmacion = window.confirm("¿Estás segur@ de que deseas eliminar este género?");
        if (!confirmacion) return;
        axios.delete(`http://localhost:3000/generos/${id}`)
            .then(() => {
                fetchGeneroList();
            }).catch((err) => {
                console.log(err);
            });
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover size="sm" responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generoList.map((genero) => (
                                        <tr key={genero.id}>
                                            <td>{genero.id}</td>
                                            <td>
                                                {genero.imagen && (
                                                    <Image 
                                                        src={`http://localhost:3000${genero.imagen}`} 
                                                        thumbnail 
                                                        style={{ width: '50px', height: '50px' }}
                                                        className="img-thumbnail"
                                                        alt={`Imagen de ${genero.nombre}`}
                                                    />
                                                )}
                                            </td>
                                            <td>{genero.nombre}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link 
                                                        to={`/generos/${genero.id}`} 
                                                        className="btn btn-primary btn-sm"
                                                        aria-label={`Editar ${genero.nombre}`}
                                                    >
                                                        <i className="bi bi-pencil-square"></i> Editar
                                                    </Link>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => eliminarGenero(genero.id)}
                                                        aria-label={`Eliminar ${genero.nombre}`}
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

export default GeneroList;