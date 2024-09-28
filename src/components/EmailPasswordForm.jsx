import React from "react";
import { Link ,Form,Row,Col, Button} from "react-router-dom";



const EmailPasswordForm = () => {
    const handleBack = () => {
        window.history.back();
    }
    return(
        <div className="d-flex justify-content-start">
          <Form className="mr-2"> {/* Añadido margen a la derecha */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formGridPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
          <Button variant="secondary" onClick={handleBack} className="ml-2">
            Volver
          </Button>
        </div>
    )
}




