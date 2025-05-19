import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Password change states
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [enteredCode, setEnteredCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Notification Modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      setNotificationMessage('New passwords do not match.');
      setNotificationSuccess(false);
      setShowNotificationModal(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/request-password-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current: passwords.current,
          newPassword: passwords.new
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to request verification code.');
      }

      setShowVerificationModal(true);
    } catch (err) {
      setNotificationMessage('Error: ' + err.message);
      setNotificationSuccess(false);
      setShowNotificationModal(true);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('/api/auth/verify-password-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: enteredCode,
          newPassword: passwords.new
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Verification failed.');
      }

      setNotificationMessage('Password successfully updated!');
      setNotificationSuccess(true);
      setShowNotificationModal(true);

      // Cleanup
      setPasswords({ current: '', new: '', confirm: '' });
      setEnteredCode('');
      setShowVerificationModal(false);
      setShowProfileModal(false);
    } catch (err) {
      setNotificationMessage('Verification failed: ' + err.message);
      setNotificationSuccess(false);
      setShowNotificationModal(true);
    }
  };

  const handleCodeInput = (e) => {
    const val = e.target.value;
    if (/^\d{0,6}$/.test(val)) {
      setEnteredCode(val);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-transparent px-3 py-2">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Navbar.Brand as={Link} to="/">AzureHub</Navbar.Brand>

          <Nav className="mx-auto">
            <Nav.Link href="#home" className="mx-2">Home</Nav.Link>
            <Nav.Link href="#rooms" className="mx-2">Rooms</Nav.Link>
            <Nav.Link href="#pricing" className="mx-2">Pricing</Nav.Link>
            <Nav.Link href="#about" className="mx-2">About</Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <Button
                variant="link"
                onClick={() => setShowProfileModal(true)}
                className="text-dark p-0"
                style={{ fontSize: '1.8rem' }}
                aria-label="User Profile"
              >
                <i className="bi bi-person-circle"></i>
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2">Sign in</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="mx-2">Sign up</Nav.Link>
              </>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Profile Modal */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        dialogClassName="modal-top-right"
      >
        <Modal.Body className="bg-light p-4">
          <div className="text-center mb-3">
            <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            <h5 className="mt-2 mb-0">{user?.name || 'User Profile'}</h5>
          </div>

          <h6 className="fw-semibold mb-2">Booking History</h6>
          <ListGroup className="mb-4">
            <ListGroup.Item>Booking #1 - Jan 10, 2025</ListGroup.Item>
            <ListGroup.Item>Booking #2 - Feb 15, 2025</ListGroup.Item>
          </ListGroup>

          <h6 className="fw-semibold mb-2">Change Password</h6>
          <Form className="mb-3" onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-2" controlId="currentPassword">
              <Form.Control
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="newPassword">
              <Form.Control
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Verification Code
            </Button>
          </Form>

          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-100"
          >
            Logout
          </Button>
        </Modal.Body>
      </Modal>

      {/* Verification Modal */}
      <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Verification Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter 6-digit verification code"
              value={enteredCode}
              onChange={handleCodeInput}
              inputMode="numeric"
              maxLength={6}
              autoFocus
              required
            />
            <Form.Text className="text-muted">
              Please enter the 6-digit code sent to your email.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerificationModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleVerifyCode}
            disabled={enteredCode.length !== 6}
          >
            Verify
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{notificationSuccess ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{notificationMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={notificationSuccess ? 'success' : 'danger'}  
            onClick={() => setShowNotificationModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NavBar;
