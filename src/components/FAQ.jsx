// src/components/FAQ.js
import React from 'react';
import { Accordion } from 'react-bootstrap';

const FAQ = () => {
  return (
    <div className="faq-container w-100 mt-4" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h3>Preguntas Frecuentes</h3>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>¿Quiénes somos?</Accordion.Header>
          <Accordion.Body>
            Somos una plataforma dedicada a proporcionar simulaciones de exámenes para que los médicos puedan entrenarse y prepararse adecuadamente para rendir el EUNACOM.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>¿Qué ofrecemos?</Accordion.Header>
          <Accordion.Body>
            Ofrecemos simulaciones de exámenes en línea basadas en el formato oficial del EUNACOM, con preguntas cuidadosamente seleccionadas para medir tus conocimientos.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>¿Qué es el EUNACOM?</Accordion.Header>
          <Accordion.Body>
            El EUNACOM es el Examen Único Nacional de Conocimientos de Medicina, un requisito para que los médicos puedan ejercer en el sistema público de salud en Chile. Consta de dos secciones, la sección teórica (ST) y la sección práctica (SP).
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>¿Cómo funcionan nuestras simulaciones?</Accordion.Header>
          <Accordion.Body>
            Nuestras simulaciones están diseñadas para replicar las condiciones del examen real, con un límite de tiempo y retroalimentación inmediata sobre tus respuestas.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>¿Cuántas veces puedo realizar las simulaciones?</Accordion.Header>
          <Accordion.Body>
            Puedes realizar las simulaciones todas las veces que quieras. Cada intento te ayudará a mejorar tus conocimientos y tiempo de respuesta.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
          <Accordion.Header>¿Qué tipo de preguntas incluyen las simulaciones?</Accordion.Header>
          <Accordion.Body>
            Las simulaciones incluyen preguntas de diversas áreas de la medicina, como Pediatría, Cirugía, Ginecología y Obstetricia, Medicina Interna, entre otras.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="6">
          <Accordion.Header>¿Qué sucede después de completar una simulación?</Accordion.Header>
          <Accordion.Body>
            Al finalizar cada simulación, recibirás un informe detallado de tus respuestas correctas e incorrectas, así como una explicación para cada pregunta.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="7">
          <Accordion.Header>¿Cómo puedo acceder a las simulaciones?</Accordion.Header>
          <Accordion.Body>
            Solo necesitas registrarte en nuestra plataforma y elegir la simulación que deseas realizar. Puedes acceder desde cualquier dispositivo con conexión a internet.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="8">
          <Accordion.Header>¿Es necesario pagar para acceder a las simulaciones?</Accordion.Header>
          <Accordion.Body>
           <p> Estamos implementando un modo de prueba de 30 min diarios</p>
           <p>Y un cobro a traves de transbanck de 5000 clp, de pago unico por usuario</p>
           <p> Porque hay que tener en cuenta que el soporte técnico de esta plataforma cuesta dinero.</p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="9">
          <Accordion.Header>¿Puedo guardar mis resultados?</Accordion.Header>
          <Accordion.Body>
            Sí, tu progreso y tus resultados se guardarán en tu perfil para que puedas hacer un seguimiento de tu mejora a lo largo del tiempo. Incluso, si lo prefieres, puedes enviar tus resultados por WhatsApp.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="10">
          <Accordion.Header>¿En qué consiste la simulación de 180 preguntas?</Accordion.Header>
          <Accordion.Body>
            Es una simulación digital del examen original con 30 minutos de intermedio y al final se muestra el resultado con el porcentaje de aciertos tal y como se califica en el examen (tener en cuenta que estas preguntas a pesar de ser 180 se sacan al azar de un banco de más de 800 preguntas).
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FAQ;