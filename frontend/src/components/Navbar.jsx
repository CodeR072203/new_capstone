import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Modal } from 'react-bootstrap';
import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleShow = () => setShowConfirm(true);
  const handleClose = () => setShowConfirm(false);
  const handleConfirmLogout = () => {
    handleLogout();
    handleClose();
  };

  return (
    <>
      <Navbar expand="lg" className="bg-transparent px-3 py-2">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbar-center" />
          <Navbar.Collapse id="navbar-center">
            <div className="row w-100 align-items-center text-center">
              {/* Left: Brand */}
              <div className="col-4 text-start">
                <Navbar.Brand as={Link} to="/">AzureHub</Navbar.Brand>
              </div>

              {/* Center: Nav Links */}
              <div className="col-4 d-flex justify-content-center">
                <Nav>
                  <Nav.Link href="#home" className="mx-2">Home</Nav.Link>
                  <Nav.Link href="#rooms" className="mx-2">Rooms</Nav.Link>
                  <Nav.Link href="#pricing" className="mx-2">Pricing</Nav.Link>
                  <Nav.Link href="#about" className="mx-2">About</Nav.Link>
                </Nav>
              </div>

              {/* Right: Auth Buttons */}
              <div className="col-4 d-flex justify-content-end align-items-center">
                {isAuthenticated ? (
                  <>
                    <span className="me-2 fw-semibold text-nowrap">
                      Welcome, {user?.name || user?.email}
                    </span>
                    <Button variant="outline-danger" size="sm" onClick={handleShow}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login" className="mx-2">Sign in</Nav.Link>
                    <Nav.Link as={Link} to="/signup" className="mx-2">Sign up</Nav.Link>
                  </>
                )}
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to sign out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Yes, Sign Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NavBar;
