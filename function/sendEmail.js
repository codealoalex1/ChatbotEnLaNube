import { Resend } from "resend";

// Inicialización estricta para producción
if (!process.env.RESEND_API_KEY) {
  throw new Error("Falta la variable de entorno RESEND_API_KEY.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPreRegistryEmail = async (name, lastname, email, code) => {
  // Estructura HTML formal
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
      <div style="text-align: center; border-bottom: 2px solid #003366; padding-bottom: 10px;">
        <h2 style="color: #003366; margin: 0;">SEGIP</h2>
        <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Servicio General de Identificación Personal</p>
      </div>
      
      <div style="padding: 20px 0;">
        <p>Estimado(a) <strong>${name} ${lastname}</strong></p>
        <p>Le informamos que su formulario de <strong>Pre-Registro de Extranjeros</strong> ha sido recibido exitosamente por nuestros sistemas.</p>
        
        <div style="background-color: #f4f6f9; border-left: 4px solid #003366; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #333;">Su código único de pre-registro es:</p>
          <h3 style="margin: 10px 0 0 0; color: #003366; font-size: 24px; letter-spacing: 2px;">${code}</h3>
        </div>
        
        <p>Por favor, conserve este código para hacer su respectivo seguimiento mediante la web o apersonándose a oficinas centrales.</p>
      </div>
      
      <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; font-size: 11px; color: #888; text-align: center;">
        <p>Este es un correo automático, por favor no responda a este mensaje.</p>
        <p>© ${new Date().getFullYear()} SEGIP Bolivia. Todos los derechos reservados.</p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "aavalosc@fcpn.edu.bo",
      subject: `Confirmación de Pre-Registro SEGIP - Código: ${code}`,
      html: htmlContent,
    });

    if (error) {
      console.error(`Error de Resend al enviar a ${email}:`, error);
      throw error;
    }

    console.log(`Correo enviado con éxito a ${email}. ID: ${data.id}`);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error(`Error crítico en servicio de correo para ${email}:`, error);
    throw error;
  }
};
