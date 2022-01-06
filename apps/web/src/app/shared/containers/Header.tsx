import { Container, Nav, Navbar } from "react-bootstrap";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isActiveRoute = (path: string): boolean => location.pathname === path;

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="/assets/images/brand_white.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          PresaCom
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} active={isActiveRoute('/suppliers')} to="/suppliers">Furnizori</Nav.Link>
            <Nav.Link as={Link} active={isActiveRoute('/outlets')} to="/outlets">Puncte de desfacere</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
