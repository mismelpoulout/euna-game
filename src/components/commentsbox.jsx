import React, { useState } from 'react';
import { Carousel, Form, Button } from 'react-bootstrap';

const CommentBox = ({ isAuthenticated }) => {
  const [comments, setComments] = useState([
    { id: 1, text: 'Gran plataforma, muy útil para estudiar.' },
    { id: 2, text: 'El sistema de preguntas me parece excelente.' },
  ]);
  const [newComment, setNewComment] = useState('');

  // Manejo del cambio en el textarea del nuevo comentario
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Manejo del envío de un nuevo comentario
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      // Agregar el nuevo comentario al estado
      setComments([...comments, { id: comments.length + 1, text: newComment }]);
      setNewComment(''); // Limpiar el campo de texto
    }
  };

  return (
    <div className="comment-box">
      {/* Carrusel de comentarios */}
      <Carousel className="mb-4" interval={null}>
        {comments.map((comment) => (
          <Carousel.Item key={comment.id}>
            <p className="comment-slide">{comment.text}</p>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Caja de comentarios - Solo se muestra si el usuario está autenticado */}
      {isAuthenticated ? (
        <Form onSubmit={handleCommentSubmit}>
          <Form.Group controlId="formComment">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={handleCommentChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            Enviar comentario
          </Button>
        </Form>
      ) : (
        <p style={{ color: 'white', marginTop: '20px' }}>
          Inicia sesión para dejar un comentario.
        </p>
      )}
    </div>
  );
};

export default CommentBox;