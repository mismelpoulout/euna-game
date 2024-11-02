import emailjs from 'emailjs-com';

const sendEmailWithUnlockCode = async (toEmail, code) => {
  const templateParams = {
    to_email: toEmail,
    unlock_code: code,
    message: `Tu código de desbloqueo es: ${code}`,
  };

  try {
    await emailjs.send(
      'service_ui5bzkr', // ID del servicio de EmailJS
      'template_5d90xxl', // ID del template configurado
      templateParams,
      'k_7K0QHhHbANBukHg' // Tu User ID de EmailJS
    );
    console.log('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error; // Aquí estaba el error, faltaba encerrar correctamente en el bloque try-catch.
  }
};

export default sendEmailWithUnlockCode;