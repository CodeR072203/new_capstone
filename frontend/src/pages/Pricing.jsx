import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import './Pricing.css';

function Pricing() {
  const amenities = [
    'Man-made Beach',
    'Wave Pool',
    'Sand Bar (open until 11 PM)',
    'Kiddie Beach Playground',
    'Paris Beach Club (Dining Area, Lockers & Showers)',
    'Sky Garden (7 AM–10 PM only, no food allowed)',
    'Convenience stores (7-Eleven, Food Stalls)',
  ];

  const additionalServices = [
    'BDO ATM Machines',
    'Paid Laundry Services',
    'Pay Parking',
    '24/7 Security Assistance',
  ];

  const pool = [
    'Pool Shifts: 7 AM–12 NN, 2 PM–7 PM',
    'Pool Fee: ₱250 per head (per shift)',
    'Kids below 3 ft are FREE',
    'Note: Pool closed every Monday for maintenance (unless Holiday)',
    'Strictly swimming attire only',
  ];

  const rules = [
    'No pets allowed',
    'No smoking inside the units',
    'No rescheduling or cancellations',
    'Light cooking only',
    'Bring at least 1 valid ID for check-in',
  ];

  return (
    <div className="pricing-section">
      <Container className="py-3 text-dark">
        <h3 className="text-center mb-3">Staycation Amenities & Rules</h3>
        <div className="bg-light mx-auto rounded-pill mb-4" style={{ height: '4px', width: '350px' }}></div>

        <Row className="g-3 mb-3">
          <Col md={3}>
            <Card className="transparent-card h-100 p-2">
              <Card.Body>
                <Card.Title className="fs-6 text-center ">Amenities for All Units</Card.Title>
                <ListGroup variant="flush" className="small">
                  {amenities.map((a, i) => (
                    <ListGroup.Item key={i} className="py-1 px-2">{a}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="transparent-card h-100 p-2">
              <Card.Body>
                <Card.Title className="fs-6 text-center ">Pool Access</Card.Title>
                <ListGroup variant="flush" className="small">
                  {pool.map((p, i) => (
                    <ListGroup.Item key={i} className="py-1 px-2">{p}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="transparent-card h-100 p-2">
              <Card.Body>
                <Card.Title className="fs-6 text-center ">House Rules</Card.Title>
                <ListGroup variant="flush" className="small">
                  {rules.map((r, i) => (
                    <ListGroup.Item key={i} className="py-1 px-2">{r}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="transparent-card text-center h-100 p-2">
              <Card.Body>
                <Card.Title className="fs-6">Additional Services & Facilities</Card.Title>
                <ListGroup variant="flush" className="small">
                  {additionalServices.map((s, i) => (
                    <ListGroup.Item key={i} className="py-1 px-2">{s}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Pricing;
