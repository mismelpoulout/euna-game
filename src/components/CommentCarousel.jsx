import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './css/commentCarousel.css'; // Archivo CSS separado para los estilos del carrusel

const CommentCarousel = () => {
  const [comments, setComments] = useState([]);

  // Obtener comentarios de Firestore
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map((doc) => doc.data());
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error al recuperar los comentarios: ', error);
      }
    };

    fetchComments();
  }, []);

  // Configuración del carrusel responsivo
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3, // Mostrar 3 comentarios en pantallas grandes
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2, // Mostrar 2 comentarios en tablets
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1, // Mostrar 1 comentario en móviles
      slidesToSlide: 1,
    },
  };

  return (
    <div className="carousel-container">
      {comments.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite={true} // Carrusel infinito
          autoPlay={true} // Reproducción automática
          autoPlaySpeed={4000} // Velocidad ajustada a 4 segundos
          showDots={false} // No mostrar puntos de navegación
          keyBoardControl={true} // Permitir control por teclado
          customTransition="transform 0.6s ease-in-out" // Transición suave
          transitionDuration={600}
          removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']} // Eliminar flechas
        >
          {comments.map((comment, index) => (
            <div
              key={index}
              className="comment-slide d-flex flex-column align-items-center text-center mx-3"
              style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', width: '100%' }}
            >
              <img
                src={comment.avatar}
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{ width: '80px', height: '80px' }}
              />
              <p className="comment-user"><strong>{comment.userName}</strong></p>
              <p className="comment-text" style={{ fontSize: '14px' }}>{comment.text}</p>
            </div>
          ))}
        </Carousel>
      ) : (
        <p>No hay comentarios disponibles.</p>
      )}
    </div>
  );
};

export default CommentCarousel;