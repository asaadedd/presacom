import { Container, Nav, Navbar } from "react-bootstrap";
import { useLocation } from "react-router";

export function Header() {
  const location = useLocation();
  const isActiveRoute = (path: string): boolean => location.pathname === path;

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/">PresaCom</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link active={isActiveRoute('/suppliers')} href="/suppliers">Furnizori</Nav.Link>
            <Nav.Link active={isActiveRoute('/outlets')} href="/outlets">Puncte de desfacere</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
