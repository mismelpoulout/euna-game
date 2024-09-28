import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';

const Home = () => {
  const navigate = useNavigate();

  const handleStartTrivia = () => {
    navigate('/trivia');
  };

  const handleStartExam = () => {
    navigate('/examen');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <Container className="mt-5">
      <AnnouncementBar />

      <Row className="gy-4 mt-4 text-center">
        <Col xs={12} md={4}>
          <Card className="shadow-sm h-100 d-flex flex-column justify-content-between card-trivia">
            <Card.Img variant="top" src="/images/trivia.webp" alt="Trivia" onClick={handleStartTrivia}/>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Button variant="primary" className="w-100 mt-auto" onClick={handleStartTrivia}>
                TRIVIA
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="shadow-sm h-100 d-flex flex-column justify-content-between card-exam">
            <Card.Img variant="top" src="/images/examen.webp" alt="Examen" onClick={handleStartExam}/>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Button variant="primary" className="w-100 mt-auto" onClick={handleStartExam}>
                EXAMEN
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="shadow-sm h-100 d-flex flex-column justify-content-between card-historial">
            <Card.Img variant="top" src="/images/historial.webp" alt="Historial" onClick={handleViewHistory}/>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Button variant="primary" className="w-100 mt-auto" onClick={handleViewHistory}>
                HISTORIAL
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="gy-4 mt-4 text-center">
        <Col xs={12}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <div className="fb-comments" data-href="https://euna-studio.web.app" data-width="" data-numposts="15"></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;