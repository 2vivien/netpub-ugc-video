
import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

// Chargement des variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testSMTP() {
  console.log('--- Démarrage du test SMTP ---');
  console.log('Hôte:', process.env.BREVO_SMTP_HOST);
  console.log('Port:', process.env.BREVO_SMTP_PORT);
  console.log('Utilisateur:', process.env.BREVO_SMTP_USER);
  console.log('Admin Email (Destinataire):', process.env.ADMIN_EMAIL);

  if (!process.env.BREVO_SMTP_PASS) {
    console.error('ERREUR: BREVO_SMTP_PASS est manquant !');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
    debug: true, // Active les logs détaillés
    logger: true  // Affiche la communication SMTP dans la console
  });

  try {
    console.log('Vérification de la connexion au serveur...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie !');

    console.log('Tentative d\'envoi d\'un mail de test...');
    const info = await transporter.sendMail({
      from: `"Test NetPub" <${process.env.BREVO_SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test de l\'API Mail - NetPub',
      text: 'Si vous recevez ce message, c\'est que votre configuration Brevo est correcte.',
      html: '<b>Félicitations !</b> Le système d\'emailing NetPub fonctionne maintenant.'
    });

    console.log('✅ Mail envoyé ! MessageId:', info.messageId);
  } catch (error) {
    console.error('❌ ÉCHEC DU TEST :');
    console.error(error);
  }
}

testSMTP();
