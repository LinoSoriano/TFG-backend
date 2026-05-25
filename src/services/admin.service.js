const { admin, db, auth } = require('../config/firebase');

async function assignRole(uid, rol) {
  await auth.setCustomUserClaims(uid, { rol });
  const userRecord = await auth.getUser(uid);
  await db.collection('usuarios').doc(uid).set({
    uid,
    email: userRecord.email,
    rol,
  }, { merge: true });
}

async function getIdiomas() {
  const snap = await db.collection('idiomas').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createIdioma(codigo_lenguaje, nombre_lenguaje) {
  const ref = await db.collection('idiomas').add({ codigo_lenguaje, nombre_lenguaje });
  return { id: ref.id, codigo_lenguaje, nombre_lenguaje };
}

module.exports = { assignRole, getIdiomas, createIdioma };
