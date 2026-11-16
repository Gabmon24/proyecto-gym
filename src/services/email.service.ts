import { MembershipService } from './membership.service.js';

export interface EmailMemberPayload {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface EmailSubscriptionPayload {
  planName: string;
  amountPaidCOP: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
}

export interface SentEmailLog {
  id: string;
  to: string;
  subject: string;
  timestamp: Date;
  previewUrl?: string;
  htmlContent: string;
}

export class EmailService {
  private static sentEmails: SentEmailLog[] = [];

  /**
   * Genera el HTML responsivo del correo de bienvenida y verificación de datos
   */
  public static generateWelcomeEmailHtml(
    member: EmailMemberPayload,
    subscription: EmailSubscriptionPayload
  ): string {
    const formattedAmount = MembershipService.formatCOP(subscription.amountPaidCOP);

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Bienvenido a Proyecto Gym</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f1115; color: #f3f4f6; margin: 0; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background-color: #17191e; border: 1px solid #2a2e37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; color: #09090b; }
    .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 14px; font-weight: 600; opacity: 0.9; }
    .body { padding: 32px 24px; }
    .welcome-text { font-size: 15px; line-height: 1.6; color: #d1d5db; margin-bottom: 24px; }
    .card { background-color: #1f232b; border: 1px solid #2e3440; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #10b981; margin-top: 0; margin-bottom: 14px; }
    .item-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2a2e37; font-size: 13px; }
    .item-row:last-child { border-bottom: none; }
    .item-label { color: #9ca3af; }
    .item-val { font-weight: 600; color: #ffffff; text-align: right; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; background-color: rgba(16, 185, 129, 0.15); color: #10b981; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: #6b7280; border-top: 1px solid #2a2e37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PROYECTO GYM</h1>
      <p>¡Confirmación de Registro y Membresía Activa!</p>
    </div>

    <div class="body">
      <p class="welcome-text">
        Hola <strong>${member.firstName}</strong>, hemos registrado exitosamente tus datos en el sistema del gimnasio. A continuación tienes el comprobante con los detalles de tu registro y plan de entrenamiento.
      </p>

      <!-- Tarjeta 1: Datos Personales Verificados -->
      <div class="card">
        <h3 class="card-title">Datos Personales Registrados</h3>
        <div class="item-row">
          <span class="item-label">Miembro Titular:</span>
          <span class="item-val">${member.firstName} ${member.lastName}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Documento de Identidad:</span>
          <span class="item-val">${member.documentType} ${member.documentNumber}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Teléfono registrado:</span>
          <span class="item-val">${member.phone || 'No registrado'}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Contacto de Emergencia:</span>
          <span class="item-val">${member.emergencyContactName || 'No registrado'} (${member.emergencyContactPhone || 'N/A'})</span>
        </div>
      </div>

      <!-- Tarjeta 2: Resumen de la Membresía y Pago -->
      <div class="card">
        <h3 class="card-title">Detalles de la Membresía</h3>
        <div class="item-row">
          <span class="item-label">Plan Adquirido:</span>
          <span class="item-val">${subscription.planName}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Fecha de Inicio:</span>
          <span class="item-val">${subscription.startDate}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Fecha de Vencimiento:</span>
          <span class="item-val">${subscription.endDate}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Método de Pago:</span>
          <span class="item-val badge">${subscription.paymentMethod.toUpperCase()}</span>
        </div>
        <div class="item-row" style="font-size: 15px; margin-top: 8px;">
          <span class="item-label" style="color: #ffffff; font-weight: bold;">Monto Pagado:</span>
          <span class="item-val" style="color: #10b981; font-size: 17px; font-weight: 800;">${formattedAmount}</span>
        </div>
      </div>

      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 24px;">
        Recuerda que para ingresar a las instalaciones solo debes indicar tu número de documento <strong>${member.documentNumber}</strong> en la terminal de recepción.
      </p>
    </div>

    <div class="footer">
      Proyecto Gym · Sistema de Gestión de Entrenamiento · Colombia<br>
      Este es un correo automático de comprobante y confirmación.
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Envía el correo de verificación y bienvenida (en desarrollo almacena en memoria y loguea)
   */
  public static async sendWelcomeEmail(
    member: EmailMemberPayload,
    subscription: EmailSubscriptionPayload
  ): Promise<{ success: boolean; messageId: string; email: string }> {
    const htmlContent = this.generateWelcomeEmailHtml(member, subscription);
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const subject = `🏋️ ¡Bienvenido(a) a Proyecto Gym, ${member.firstName}! Verificación de Membresía`;

    const emailLog: SentEmailLog = {
      id: messageId,
      to: member.email,
      subject,
      timestamp: new Date(),
      htmlContent,
    };

    this.sentEmails.unshift(emailLog);

    console.log(`✉️ [EmailService] Correo enviado exitosamente a: ${member.email}`);
    console.log(`   Asunto: "${subject}"`);
    console.log(`   ID Mensaje: ${messageId}`);

    return {
      success: true,
      messageId,
      email: member.email,
    };
  }

  /**
   * Obtiene la bandeja de correos enviados en el sistema (para auditoría o previsualización)
   */
  public static getSentEmails(): SentEmailLog[] {
    return this.sentEmails;
  }
}
