import React, { useState } from 'react';
import { Navbar, Nav, Row, Container, Modal, Button, Form, NavbarText } from 'react-bootstrap';
import { signOut } from 'firebase/auth'; // Importa el método signOut de Firebase
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig'; // Asegúrate de importar correctamente el auth

import './ztyle.css';
import Home from '../Home';

const NavigationBar = ({ setIsAuthenticated }) => {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleCloseContact = () => setShowContact(false);
  const handleShowContact = () => setShowContact(true);

  const handleCloseAbout = () => setShowAbout(false);
  const handleShowAbout = () => setShowAbout(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappNumber = "+56927581258";
    const whatsappMessage = `Nombre: ${formData.name}%0AEmail: ${formData.email}%0AMensaje: ${formData.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
    handleCloseContact();
  };
    const navigate = useNavigate();
  
    const handleLogout = () => {
      signOut(auth)
        .then(() => {
          // Cerrar sesión exitosa
          setIsAuthenticated(false); // Actualizar el estado de autenticación
          navigate('/'); // Redirigir a la pantalla de bienvenida
        })
        .catch((error) => {
          console.error('Error cerrando sesión:', error);
        });
    };

  return (
    <>
     <Row style={{ paddingTop: '80px' }}>
  <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
  <Container>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ml-auto">
      {/* Cambia el Nav.Link a Link de react-router-dom */}
      <Nav.Link as={Link} to="/" style={{ color: 'black' }}>
        Home
      </Nav.Link>
      <Nav.Link href="#about" style={{ color: 'black' }} onClick={handleShowAbout}>
        About
      </Nav.Link>
      <Nav.Link href="#services" style={{ color: 'black' }}>
        Services
      </Nav.Link>
      <Nav.Link href="#contact" style={{ color: 'black' }} onClick={handleShowContact}>
        Contact
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
  <Button variant="outline-light" onClick={handleLogout}>
    Cerrar Sesión
  </Button>
</Container>
    
  </Navbar>
</Row>

      {/* Modal de About */}
      <Modal show={showAbout} onHide={handleCloseAbout}>
        <Modal.Header closeButton>
          <Modal.Title>Acerca de Nosotros</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Este sitio es creado, editado y modificado por Medstudio&Co.</p>
          <p>
POLITICA DE PRIVACIDAD
Última actualización 30 de NOVIEMBRE de 2020

Al instalar la aplicación móvil que enlaza con esta política de privacidad (la "Política de privacidad" y la "Aplicación afiliada"), usted acepta cumplir y estar sujeto a la siguiente Política de privacidad y, cuando corresponda, a cualquier otra política de reglas operativas de Medstudio. y otros términos y condiciones o documentos complementarios que pueden publicarse de vez en cuando. Revise la Política de privacidad detenidamente.
General

La Aplicación afiliada utiliza uno o más de los servicios ofrecidos por Medstudio. Si bien Medstudio no es el editor de la Aplicación afiliada, sí ofrece los servicios de inteligencia y análisis móviles de la Aplicación afiliada mediante la recopilación de cierta información relacionada con su uso de la Aplicación afiliada y / u otras aplicaciones instaladas en su dispositivo, y otras funciones de su dispositivo móvil. dispositivo para permitir que la Aplicación Afiliada y otros socios de Medstudio entreguen anuncios, productos y servicios que sean relevantes y significativos para sus usuarios (colectivamente: los "Servicios").

Política de privacidad

Esta Política de privacidad describe las prácticas de privacidad asociadas con el Servicio Medstudio y cubre nuestro tratamiento de la información personal que recopilamos cuando instala una aplicación móvil que utiliza nuestro Servicio. Tenga en cuenta que no somos responsables ni tenemos control de las prácticas de privacidad de ninguna aplicación móvil (incluida la Aplicación afiliada) y no tenemos control sobre cómo el desarrollador de una aplicación móvil recopila, usa o comparte información sobre usted. Para obtener información sobre cómo una aplicación móvil recopila, usa o comparte información sobre usted, consulte la política de privacidad de la aplicación móvil correspondiente.

Información que recopilamos de usted

Cuando instala una Aplicación afiliada en su dispositivo que utiliza nuestro Servicio, podemos recopilar automáticamente cierta información de su dispositivo Android, marca y modelo del dispositivo, tipo y versión del navegador web móvil, dirección IP, dirección MAC, marca y versión del sistema operativo del dispositivo. , información de ubicación, información de MCC (código de país móvil), el nombre de la aplicación móvil, una lista de aplicaciones móviles instaladas en su dispositivo y otros datos técnicos sobre su dispositivo. Cuando instala una Aplicación afiliada, también puede otorgar permiso a la aplicación móvil para recopilar ciertos tipos de información a través de un proceso de consentimiento de pantalla de permisos y para usar parte de su conexión de red y los recursos del dispositivo cuando sus recursos están inactivos y usan WiFi (solo ocasionalmente celular se pueden utilizar datos, pero muy limitados). No controlamos el proceso de consentimiento de la pantalla de permisos; normalmente lo ejecuta su sistema operativo móvil;

SIN EMBARGO, UNA VEZ QUE USTED OTORGA DICHO PERMISO EN BASE A LA OPCIÓN, PODEMOS RECOPILAR ALGUNA, PERO NO TODA, LA INFORMACIÓN QUE UNA APLICACIÓN MÓVIL RECOPILA DE ACUERDO CON LOS PERMISOS QUE USTED OTORGA. POR EJEMPLO, DE ACUERDO CON SU PERMISO PARA LA SOLICITUD AFILIADA, PODEMOS RECOPILAR GEOLOCALIZACIÓN PRECISA, HISTORIAL DEL NAVEGADOR, PAÍS, CÓDIGO POSTAL E ID DE DISPOSITIVO (INCLUYENDO IMEI, NÚMERO DE SERIE DEL DISPOSITIVO Y DIRECCIÓN MAC) Y / O CUALQUIER OTRA INFORMACIÓN PERSONAL O IDENTIFICACIÓN LA “INFORMACIÓN PERSONAL”).

Nosotros o nuestros socios de datos también podemos obtener información de otras fuentes y combinarla con la información que recopilamos a través de nuestro Servicio. Por ejemplo, Podemos recopilar uno de los identificadores únicos asociados con su dispositivo móvil como se enumera anteriormente e información demográfica o de preferencia de intereses de otras compañías y combinarlo con la información que recopilamos a través del Servicio para permitir que nuestros clientes entreguen anuncios que puedan ser de su interés en su dispositivo móvil o para identificarlo en otros dispositivos o navegadores. Anonimizamos toda la información personal de su dispositivo antes de recopilarla o compartirla con nuestros socios de datos. La aplicación afiliada incorpora servicios de oneAudience de terceros para recopilar información de su dispositivo con la política de privacidad de oneAudience que se encuentra aquí: http://www.oneaudience.com/privacy/. Además de otra información descrita en esta política, podemos recopilar y compartir información de ubicación precisa, a través de métodos como los "SDK" móviles. Esta información de ubicación puede ser utilizada por sí misma, agregada o combinada con identificadores móviles (como IDFA e ID de Android), y compartida con terceros, para fines relacionados con publicidad, atribución (por ejemplo, medición del rendimiento de anuncios), análisis e investigación. Puede eliminar su consentimiento para que se recopilen los datos de su ubicación cambiando la configuración de su dispositivo. (Algunos servicios pueden perder funcionalidad como resultado). Puede optar por no recibir publicidad basada en intereses a través de la configuración de su dispositivo. Cuando haya optado por no usar esta configuración en un dispositivo, los anunciantes no utilizarán la información en la aplicación recopilada de ese dispositivo para inferir sus intereses o publicar anuncios en ese dispositivo que estén orientados en función de sus intereses inferidos. Una Aplicación afiliada se basa en parte en aplicaciones y servicios proporcionados por Google y YouTube, y utiliza los Servicios API de YouTube. El uso del Servicio API de YouTube está sujeto a los Términos de servicio de You Tube, disponibles en: https://www.youtube.com/t/terms y la Política de privacidad de Google disponible en: http://www.google.com/ políticas / privacidad.

Cómo usamos la información

Cualquier información que nos envíe seguirá siendo de su propiedad. Sin embargo, podemos usarlo para los fines descritos en este documento. Servicio. Nos reservamos el derecho de utilizar la información (incluida la información personal) que recopilamos para administrar, operar y mejorar continuamente nuestro Servicio. También podemos utilizar la información para monitorear y analizar tendencias, uso y actividades en relación con nuestro Servicio. Siempre que, sin embargo, no se divulgue información personal a terceros dentro del alcance de esta cláusula, que no sean los afiliados de confianza de Medstudio que son responsables de respaldar o mejorar nuestros Servicios, y solo para tales fines. Para este propósito, aunque no contamos con un certificado oficial o autoemitido, nos esforzamos por cumplir con las reglas de Puerto Seguro en www.export.gov/SafeHarbor. Anuncios. Nos reservamos el derecho de utilizar la Información personal (y / o cualquier otra información aplicable) que recopilamos para crear, comercializar y distribuir segmentos de audiencia anonimizados a terceros. Compartiremos la información personal (y / o cualquier otra información aplicable) que recopilemos con anunciantes y comercializadores de terceros no afiliados para fines no relacionados con la transacción original del consumidor. Nosotros o nuestros socios de datos podemos personalizar contenido y anuncios personalizados y conectar ciertos datos demográficos u otros datos sobre usted (recibidos de terceros) con los datos que hemos recopilado de usted, como el identificador de su dispositivo móvil o la dirección IP. Para este propósito, aunque no contamos con un certificado oficial o autoemitido, nos esforzamos por cumplir con las reglas de Safe Harbor en www.export.gov/SafeHarbor. Información agregada. Recopilamos información agregada sobre nuestros usuarios para optimizar mejor nuestro Servicio, preferencias y para ayudar en nuestros esfuerzos de marketing. También podemos compartir datos agregados sobre nuestra base de usuarios, incluida la cantidad de usuarios que tenemos, ciertas tendencias, datos estadísticos, etc., sin revelar ninguna información personal. Nota legal. Sin perjuicio de cualquier disposición en contrario, nos reservamos el derecho de compartir cualquier información, incluida la Información personal (a) según lo requiera la ley y / o para cumplir con un procedimiento judicial, orden judicial o proceso legal presentado en Medstudio; (b) cuando creemos que la divulgación es necesaria para proteger nuestros derechos; (c) si creemos que está violando los términos y condiciones de esta Política de privacidad o cualquier otra de nuestras reglas operativas, código de conducta, políticas y otros términos y condiciones o documentos complementarios que podamos poner a su disposición en algún momento. a tiempo, e incluida la Aplicación afiliada,
Optar por no participar

Cancelación de la recopilación de información.

PARA DESACTIVAR COMPLETAMENTE LA RECOPILACIÓN Y EL USO DE CUALQUIER INFORMACIÓN PERSONAL DE Medstudio, DEBE DESINSTALAR TODAS LAS APLICACIONES AFILIADAS EN SU DISPOSITIVO. SIN EMBARGO, ELIMINAR LAS DICHAS APLICACIONES SÓLO TENDRÁ EFECTO PARA LOS FINES DE LA TRANSACCIÓN DE FUTUROS NEGOCIOS. TAMBIÉN TAL ACCIÓN NO SERÁ EFECTIVA CON RESPECTO A LA ELIMINACIÓN DE LA INFORMACIÓN PERSONAL YA RECOPILADA COMO PARTE DE NUESTRO SERVICIO, Y Medstudio PODRÁ CONTINUAR Y HACER EL USO DE DICHA INFORMACIÓN DE ACUERDO CON ESTA POLÍTICA DE PRIVACIDAD, COMO SE MODIFICA DE VEZ EN TIEMPO. SI DESEA QUE CUALQUIER INFORMACIÓN PERSONAL RECOPILADA ANTERIORMENTE SE ELIMINE DE NUESTRA BASE DE DATOS, CONTÁCTENOS EN WWW.Medstudio.COM. TENGA EN CUENTA, SIN EMBARGO, QUE COMO SE DESCRIBE AQUÍ, CIERTOS RESIDUOS DE LA INFORMACIÓN PERSONAL PUEDEN INCORPORARSE BAJO OTRO CONTENIDO O MATERIALES CREADOS Y UTILIZADOS POR Medstudio Y / U OTROS TERCEROS APLICABLES (LOS "RESIDUOS"), Y DEBIDO A LA NATURALEZA DE LOS RESIDUOS, NO PODRÍAN SER IDENTIFICADOS PARA SER ELIMINADO, NI Medstudio PUEDE PREVENIR EL USO DE DICHOS RESIDUOS. ADEMÁS, NOS RESERVAMOS EL DERECHO DE MANTENER CIERTOS REGISTROS CON FINES DE SUPERVISIÓN, REGLAMENTACIÓN, LITIGIO Y / O APLICACIÓN. TENGA EN CUENTA QUE SI ALGUNA VEZ INSTALA OTRA APLICACIÓN AFILIADA QUE UTILIZA NUESTRO SERVICIO EN EL FUTURO, Medstudio PODRÁ RECIBIR Y USAR SU INFORMACIÓN PERSONAL COMO SE DESCRIBE EN ESTA POLÍTICA DE PRIVACIDAD. Medstudio TAMPOCO PUEDE PREVENIR EL USO DE DICHOS RESIDUOS. ADEMÁS, NOS RESERVAMOS EL DERECHO DE MANTENER CIERTOS REGISTROS CON FINES DE SUPERVISIÓN, REGLAMENTACIÓN, LITIGIO Y / O APLICACIÓN. TENGA EN CUENTA QUE SI ALGUNA VEZ INSTALA OTRA APLICACIÓN AFILIADA QUE UTILIZA NUESTRO SERVICIO EN EL FUTURO, Medstudio PODRÁ RECIBIR Y USAR SU INFORMACIÓN PERSONAL COMO SE DESCRIBE EN ESTA POLÍTICA DE PRIVACIDAD. Medstudio TAMPOCO PUEDE PREVENIR EL USO DE DICHOS RESIDUOS. ADEMÁS, NOS RESERVAMOS EL DERECHO DE MANTENER CIERTOS REGISTROS CON FINES DE SUPERVISIÓN, REGLAMENTACIÓN, LITIGIO Y / O APLICACIÓN. TENGA EN CUENTA QUE SI ALGUNA VEZ INSTALA OTRA APLICACIÓN AFILIADA QUE UTILIZA NUESTRO SERVICIO EN EL FUTURO, Medstudio PODRÁ RECIBIR Y USAR SU INFORMACIÓN PERSONAL COMO SE DESCRIBE EN ESTA POLÍTICA DE PRIVACIDAD.
Uso apropiado

Usted acepta que utilizará el Servicio de conformidad con todas las leyes, normas y reglamentos locales, estatales, nacionales e internacionales aplicables, incluidas las leyes relativas a la transmisión de datos técnicos exportados desde su país de residencia. No deberá, no aceptará y no autorizará ni alentará a ningún tercero a: (a) utilizar el Servicio para cargar, transmitir o distribuir cualquier contenido que sea ilegal, difamatorio, acosador, abusivo, fraudulento, obsceno o que contenga virus, o es objetable de otro modo según lo determinado razonablemente por el Servicio; (b) cargar, transmitir o distribuir contenido que infrinja los derechos de propiedad intelectual de terceros u otros derechos u obligaciones de propiedad, contractuales o fiduciarios; (c) evitar que otros utilicen el Servicio; (d) utilizar el Servicio para cualquier propósito fraudulento o inapropiado; (e) interferir, dañar, inhabilitar, sobrecargar, perjudicar o interrumpir de cualquier forma el Servicio; (f) actuar de cualquier manera que viole las políticas del Servicio, que pueden ser revisadas de vez en cuando. La violación de cualquiera de los anteriores puede resultar en la terminación inmediata de este Acuerdo y puede someterlo a sanciones estatales y federales y otras consecuencias legales. Medstudio se reserva el derecho, pero no tendrá la obligación, de investigar su uso del Servicio para determinar si se ha producido una violación del Acuerdo o para cumplir con cualquier ley, regulación, proceso legal o solicitud gubernamental aplicable. como puede ser revisado de vez en cuando. La violación de cualquiera de los anteriores puede resultar en la terminación inmediata de este Acuerdo y puede someterlo a sanciones estatales y federales y otras consecuencias legales. Medstudio se reserva el derecho, pero no tendrá la obligación, de investigar su uso del Servicio para determinar si se ha producido una violación del Acuerdo o para cumplir con cualquier ley, regulación, proceso legal o solicitud gubernamental aplicable. como puede ser revisado de vez en cuando. La violación de cualquiera de los anteriores puede resultar en la terminación inmediata de este Acuerdo y puede someterlo a sanciones estatales y federales y otras consecuencias legales. Medstudio se reserva el derecho, pero no tendrá la obligación, de investigar su uso del Servicio para determinar si se ha producido una violación del Acuerdo o para cumplir con cualquier ley, regulación, proceso legal o solicitud gubernamental aplicable.
Materiales no solicitados

Cualquier material no solicitado enviado o enviado a Medstudio, no se considerará confidencial o secreto. Al enviar o enviar información u otro material a Medstudio, usted: (a) Garantiza que tiene todos los derechos de cualquier tipo sobre el material y que, según su leal saber y entender, ninguna otra parte tiene ningún derecho sobre el material; (b) A menos que se indique específicamente lo contrario en el mismo, otorgue a Medstudio una licencia ilimitada, perpetua e irrevocable para usar, reproducir, mostrar, ejecutar, modificar, transmitir y distribuir el material, y además acepta que Medstudio es libre de usar cualquier idea, conocimiento cómo, conceptos o técnicas que nos envía para cualquier propósito, sin ningún tipo de compensación para usted o cualquier otra persona. Para eliminar todas las dudas, la obligación relacionada con la privacidad de Medstudio de esta Política de privacidad no se aplicará a la información no solicitada.
</p>
          {/* Aquí puedes incluir el texto adicional que desees, incluso un largo texto legal como el que mencionaste */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAbout}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Contacto */}
      <Modal show={showContact} onHide={handleCloseContact}>
        <Modal.Header closeButton>
          <Modal.Title>Whatsapp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formMessage">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default NavigationBar;