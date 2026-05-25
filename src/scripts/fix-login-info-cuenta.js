// Uso: node src/scripts/fix-login-info-cuenta.js
// Corrige el texto de login.infoCuenta en todas las traducciones de Firestore:
// eliminaba la referencia incorrecta a sincronización de ficha médica.
require('dotenv').config();
const { db } = require('../config/firebase');

const NUEVOS_TEXTOS = {
  es: 'Tu cuenta te permite identificarte en la aplicación y mantener un registro de actividad de tus dispositivos.',
  en: 'Your account lets you identify yourself in the app and keep an activity log of your devices.',
  no: 'Kontoen din lar deg identifisere deg i appen og holde en aktivitetslogg over enhetene dine.',
  fr: "Votre compte vous permet de vous identifier dans l'application et de conserver un journal d'activité de vos appareils.",
  ca: "El teu compte et permet identificar-te a l'aplicació i mantenir un registre d'activitat dels teus dispositius.",
  da: 'Din konto giver dig mulighed for at identificere dig i appen og føre en aktivitetslog over dine enheder.',
};

async function main() {
  // Buscar el documento con nombre_texto = 'login.infoCuenta'
  const snap = await db.collection('traducciones')
    .where('nombre_texto', '==', 'login.infoCuenta')
    .get();

  if (snap.empty) {
    console.error('No se encontró el documento login.infoCuenta en traducciones.');
    process.exit(1);
  }

  for (const doc of snap.docs) {
    await doc.ref.update({ traducciones: NUEVOS_TEXTOS });
    console.log(`✓ Actualizado documento ${doc.id} (login.infoCuenta)`);
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
