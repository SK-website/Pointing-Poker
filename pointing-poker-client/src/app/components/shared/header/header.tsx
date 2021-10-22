import { Container, Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

function Header(): JSX.Element {
  const location = useLocation();

  const pageName: string = location.pathname.split('/')[1];
  let pageTitle: string;

  switch (pageName) {
    case '':
      pageTitle = 'Home';
      break;
    case 'start':
      pageTitle = 'Home';
      break;
    case 'lobby':
      pageTitle = 'Lobby';
      break;
    case 'game':
      pageTitle = 'Game';
      break;
    case 'result':
      pageTitle = 'Results';
      break;
    default:
      pageTitle = 'Nothing';
      break;
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Pointing Poker</Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link active>{pageTitle}</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
