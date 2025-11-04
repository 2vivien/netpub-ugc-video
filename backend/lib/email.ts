import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });
  }

  async sendContactNotification(contactData: ContactFormData): Promise<boolean> {
    try {
      console.log(`📧 Envoi d'une notification de contact à l'admin pour ${contactData.name}`);
      const mailOptions = {
        from: '"NetPub Contact" <org.netpub@gmail.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `Nouveau message de contact - ${contactData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
              Nouveau message de contact
            </h2>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Informations du contact :</h3>
              <p><strong>Nom :</strong> ${contactData.name}</p>
              <p><strong>Email :</strong> ${contactData.email}</p>
              ${contactData.company ? `<p><strong>Entreprise :</strong> ${contactData.company}</p>` : ''}
              ${contactData.service ? `<p><strong>Service demandé :</strong> ${contactData.service}</p>` : ''}

              <h3 style="color: #495057; margin-top: 30px;">Message :</h3>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                ${contactData.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>Ce message a été envoyé automatiquement depuis le formulaire de contact NetPub.</p>
            </div>
          </div>
        `,
        text: `
Nouveau message de contact

Informations du contact :
- Nom : ${contactData.name}
- Email : ${contactData.email}
${contactData.company ? `- Entreprise : ${contactData.company}` : ''}
${contactData.service ? `- Service demandé : ${contactData.service}` : ''}

Message :
${contactData.message}

---
Ce message a été envoyé automatiquement depuis le formulaire de contact NetPub.
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de notification envoyé avec succès à l\'admin');
      return true;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de notification:', error);
      return false;
    }
  }

  async sendAutoReply(contactData: ContactFormData): Promise<boolean> {
    try {
      console.log(`📧 Envoi d'une réponse automatique à ${contactData.email}`);
      const mailOptions = {
        from: '"NetPub Agency" <org.netpub@gmail.com>',
        to: contactData.email, // L'email va au contacteur, pas à l'admin
        subject: 'Merci pour votre message - NetPub Agency',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #667eea; margin: 0;">NetPub Agency</h1>
              <p style="color: #666; margin: 5px 0;">Agence de production vidéo UGC & publicitaire</p>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">Merci ${contactData.name} !</h2>

              <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                Nous avons bien reçu votre message et nous vous remercions de l'intérêt que vous portez à nos services.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                Notre équipe va analyser votre demande et vous répondra dans les plus brefs délais, généralement sous 24h ouvrées.
              </p>

              <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #495057; margin-top: 0;">Récapitulatif de votre demande :</h3>
                ${contactData.service ? `<p><strong>Service demandé :</strong> ${contactData.service}</p>` : ''}
                ${contactData.company ? `<p><strong>Entreprise :</strong> ${contactData.company}</p>` : ''}
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                N'hésitez pas à nous contacter directement si vous avez des questions urgentes :
              </p>

              <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>📞 Téléphone :</strong> +229 01 54 10 21 25</p>
                <p style="margin: 5px 0;"><strong>✉️ Email :</strong> org.netpub@gmail.com</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>Cordialement,<br>L'équipe NetPub Agency</p>
              <p>🇫🇷 Paris & 🇧🇯 Cotonou</p>
            </div>
          </div>
        `,
        text: `
Bonjour ${contactData.name},

Merci pour votre message !

Nous avons bien reçu votre demande et notre équipe vous répondra dans les plus brefs délais.

${contactData.service ? `Service demandé : ${contactData.service}` : ''}
${contactData.company ? `Entreprise : ${contactData.company}` : ''}

Pour nous contacter directement :
- Téléphone : +229 01 54 10 21 25
- Email : org.netpub@gmail.com

Cordialement,
L'équipe NetPub Agency
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de réponse automatique envoyé avec succès');
      return true;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de réponse automatique:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();