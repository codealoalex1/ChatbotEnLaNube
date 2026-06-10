import nodemailer from "nodemailer";

/**
 * Configura el transportador de Nodemailer.
 * En Railway se leerán las variables de entorno configuradas en el panel.
 */
const createTransporter = () => {
  // Validación estricta para evitar fallos silenciosos en producción
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    throw new Error(
      "Faltan las variables de entorno para la configuración del correo.",
    );
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true" && process.env.EMAIL_PORT === 465, // true para puerto 465, false para otros
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Esto asegura que en Railway no haya problemas de handshake SSL/TLS con ciertos proveedores
    tls: {
      rejectUnauthorized: false /* process.env.NODE_ENV === 'production' */,
      ciphers: "SSLv3", // Ayuda a compatibilidad en redes estrictas
    },
  });
};

/**
 * Envía el correo de confirmación de pre-registro del SEGIP
 * @param {string} toEmail - Correo del ciudadano extranjero
 * @param {string} applicantName - Nombre completo del solicitante
 * @param {string} preRegistryCode - Código de trámite generado
 */
export const sendPreRegistryEmail = async (name, lastname, email, code) => {
  const transporter = createTransporter();

  // Estructura HTML formal simulando al SEGIP
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
      <div style="text-align: center; border-bottom: 2px solid #003366; padding-bottom: 10px;">
        <h2 style="color: #003366; margin: 0;">SEGIP</h2>
        <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Servicio General de Identificación Personal</p>
      </div>
      
      <div style="padding: 20px 0;">
        <p>Estimado(a) <strong>${name}, ${lastname}</strong></p>
        <p>Le informamos que su formulario de <strong>Pre-Registro de Extranjeros</strong> ha sido recibido exitosamente por nuestros sistemas.</p>
        
        <div style="background-color: #f4f6f9; border-left: 4px solid #003366; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #333;">Su código único de pre-registro es:</p>
          <h3 style="margin: 10px 0 0 0; color: #003366; font-size: 24px; letter-spacing: 2px;">${code}</h3>
        </div>
        
        <p>Por favor, conserve este código para hacer su respectivo seguimiento mediante la web o apersonandose a oficinas centrales</p>
      </div>
      
      <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; font-size: 11px; color: #888; text-align: center;">
        <p>Este es un correo automático, por favor no responda a este mensaje.</p>
        <p>© ${new Date().getFullYear()} SEGIP Bolivia. Todos los derechos reservados.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"SEGIP Pre-Registro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Confirmación de Pre-Registro SEGIP - Código: ${code}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Correo enviado con éxito a ${email}. MessageId: ${info.messageId}`,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error al enviar a ${email}:`, error);
    throw error; // Delegamos el error al controlador principal
  }
};
