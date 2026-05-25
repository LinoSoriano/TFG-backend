// Uso: node src/scripts/fix-usuarios.js
// Busca documentos en la colección `usuarios` a los que les falte uid o email
// y los completa con los datos de Firebase Authentication.
require('dotenv').config();
const { auth, db } = require('../config/firebase');

async function main() {
  const snap = await db.collection('usuarios').get();
  let fixed = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.uid && data.email) continue;

    try {
      const userRecord = await auth.getUser(doc.id);
      await doc.ref.set({
        uid: userRecord.uid,
        email: userRecord.email,
        ...(data.rol ? { rol: data.rol } : {}),
      }, { merge: true });
      console.log(`✓ Corregido: ${doc.id} → ${userRecord.email}`);
      fixed++;
    } catch (err) {
      console.warn(`⚠ No se pudo resolver uid ${doc.id}: ${err.message}`);
    }
  }

  console.log(`\nFin: ${fixed} documento(s) corregido(s) de ${snap.size} total.`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
