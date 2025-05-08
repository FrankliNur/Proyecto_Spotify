import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';


const Menu = () => {
    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={NavLink} to="/">ADMIN</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* <NavLink to="/" className='nav-link' end>Home</NavLink> */}
                        <NavDropdown title="Géneros" id="basic-nav-dropdown">  {/* Cambiado */}
                            <NavDropdown.Item as={NavLink} to="/generos/create">Crear Género</NavDropdown.Item>  {/* Cambiado */}
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={NavLink} to="/">Lista de Géneros</NavDropdown.Item>  {/* Cambiado */}
                        </NavDropdown>
                        <NavDropdown title="Artistas" id="artistas-nav-dropdown">
                            <NavDropdown.Item as={NavLink} to="/artistas/create">Crear Artista</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/artistas">Lista de Artistas</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Álbumes" id="albumes-dropdown">
                            <NavDropdown.Item as={NavLink} to="/albumes/create">Crear Álbum</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/albumes">Lista de Álbumes</NavDropdown.Item>
                        </NavDropdown>


<NavDropdown title="Canciones" id="canciones-dropdown">
  <NavDropdown.Item as={NavLink} to="/canciones/create">
    Crear Canción
  </NavDropdown.Item>
  <NavDropdown.Item as={NavLink} to="/canciones">
    Lista de Canciones
  </NavDropdown.Item>
</NavDropdown>


                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Menu;