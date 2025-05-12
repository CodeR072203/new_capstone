"use client"

import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import trialImg from '../assets/trial3.jpg';

function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signup, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(email, password, name)
    navigate("/verify-email")
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 shadow-lg rounded overflow-hidden" style={{ maxWidth: "900px" }}>
        {/* Left Image Section */}
        <Col md={6} className="d-none d-md-block p-0">
          <img
            src={trialImg} // Replace with your image path
            alt="Room"
            className="img-fluid h-100 w-100 object-fit-cover"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </Col>

        {/* Right Form Section */}
        <Col xs={12} md={6} className="bg-white p-5">
          <div className="text-center mb-4">
            <h2>Create an Account</h2>
            <p className="text-muted">Please enter your details</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <Form.Text className="text-muted">
                We'll never share your email.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button type="submit" className="w-100 py-2" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-primary">Log In</Link>
            </p>
            <p>
              <Link to="/" className="text-secondary">Back</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default SignUpPage
