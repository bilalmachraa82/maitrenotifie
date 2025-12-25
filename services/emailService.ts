
/**
 * Serviço de Integração Resend
 * Desenvolvido para: Escola de Musique d'Élancourt
 * Assistant: João Ferreira
 */

export interface EmailPayload {
  to: string[];
  subject: string;
  homeworkText: string;
  className: string;
  summary: string;
}

export async function sendHomeworkEmail(payload: EmailPayload): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_placeholder'; // Será injetado externamente
  
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #3730a3; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">École de Musique d'Élancourt</h1>
        <p style="margin: 4px 0 0; opacity: 0.8; font-size: 12px;">Suivi Pédagogique - Assistant João Ferreira</p>
      </div>
      <div style="padding: 32px; color: #1e293b; line-height: 1.6;">
        <p>Bonjour,</p>
        <p>Voici les devoirs pour la classe de <strong>${payload.className}</strong> suite au cours d'aujourd'hui :</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 24px 0; font-size: 15px; white-space: pre-wrap;">
          ${payload.homeworkText}
        </div>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
          <h3 style="font-size: 14px; color: #64748b; margin-bottom: 8px; text-transform: uppercase;">Résumé de la séance :</h3>
          <p style="font-size: 13px; color: #475569; font-style: italic;">${payload.summary}</p>
        </div>
        
        <p style="margin-top: 32px; font-size: 13px; color: #94a3b8; text-align: center;">
          Ceci est un message automatique de MaîtreNotifie. <br/>
          &copy; ${new Date().getFullYear()} École de Musique d'Élancourt
        </p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'MaîtreNotifie <eleves@musique-elancourt.fr>',
        to: payload.to,
        subject: payload.subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro Resend:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Falha no envio do e-mail:', error);
    return false;
  }
}
