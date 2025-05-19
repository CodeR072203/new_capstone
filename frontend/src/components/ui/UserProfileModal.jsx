import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Card } from 'react-bootstrap';

const UserProfileModal = ({ user, onLogout }) => {
  const [show, setShow] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setShowVerification(true);

    // Simulate sending the code (you can integrate with Resend backend here)
    alert(`Verification code sent: ${code}`);
  };

  const handleVerification = () => {
    if (enteredCode === generatedCode) {
      alert("Password updated successfully!");
      // TODO: Add API call here to update password

      // Reset state
      setPasswords({ current: '', new: '', confirm: '' });
      setEnteredCode('');
      setShowVerification(false);
      setShow(false);
    } else {
      alert("Invalid verification code.");
    }
  };

  const handleCodeInput = (e) => {
    const val = e.target.value;
    // Allow only numeric and max 6 digits
    if (/^\d{0,6}$/.test(val)) {
      setEnteredCode(val);
    }
  };

  return (
    <>
      {/* Profile Button */}
      <Button
        variant="link"
        onClick={() => setShow(true)}
        className="ms-2 p-0"
        aria-label="Profile"
        style={{ fontSize: '1.8rem' }}
      >
        <i className="bi bi-person-circle"></i>
      </Button>

      {/* Main Profile Modal */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-top-right"
        contentClassName="border-0 rounded-4 shadow"
      >
        <Card className="border-0 rounded-4">
          <Card.Body className="p-4 bg-light">
            <div className="text-center mb-3">
              <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              <h5 className="mt-2">{user?.name || 'User Profile'}</h5>
            </div>

            <h6 className="mb-2">Booking History</h6>
            <ListGroup className="mb-3 shadow-sm rounded-3">
              <ListGroup.Item>Booking #1 - Jan 10, 2025</ListGroup.Item>
              <ListGroup.Item>Booking #2 - Feb 15, 2025</ListGroup.Item>
            </ListGroup>

            <h6 className="mb-2">Change Password</h6>
            <Form onSubmit={handlePasswordChange} className="mb-3">
              <Form.Group className="mb-2">
                <Form.Control
                  type="password"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send Verification Code
              </Button>
            </Form>

            <Button
              variant="danger"
              onClick={() => {
                onLogout?.();
                setShow(false);
              }}
              className="w-100"
            >
              Logout
            </Button>
          </Card.Body>
        </Card>
      </Modal>

      {/* Verification Modal */}
      <Modal show={showVerification} onHide={() => setShowVerification(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Your Identity</Modal.Title>
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
            />
            <Form.Text className="text-muted">
              Check your inbox for the verification code.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerification(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleVerification}
            disabled={enteredCode.length !== 6}
          >
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserProfileModal;
