import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>Nexus Ideas</BootstrapNavbar.Brand>
        </LinkContainer>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <LinkContainer to="/dashboard">
                  <Nav.Link>All Insights</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/my-insights">
                  <Nav.Link>My Insights</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>

          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <BootstrapNavbar.Text className="me-3">
                  Welcome, {user?.name || user?.email}
                </BootstrapNavbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Nav.Link>Sign Up</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
