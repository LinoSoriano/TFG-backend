// Uso: node src/scripts/set-admin.js <email>
// Asigna customClaim { rol: 'gestor' } al usuario con ese email.
require('dotenv').config();
const { admin, auth, db } = require('../config/firebase');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Uso: node src/scripts/set-admin.js <email>');
    process.exit(1);
  }

  const userRecord = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(userRecord.uid, { rol: 'gestor' });
  await db.collection('usuarios').doc(userRecord.uid).set({ rol: 'gestor' }, { merge: true });

  console.log(`✓ Rol 'gestor' asignado a ${email} (uid: ${userRecord.uid})`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
