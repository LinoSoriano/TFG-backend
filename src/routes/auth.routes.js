const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');
const { COL_USUARIOS, COL_REGISTRO_DISPOSITIVOS } = require('../config/collections');

// POST /api/auth/verify
// Verifica el token Firebase y registra/actualiza el usuario en Firestore
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const userRef = db.collection(COL_USUARIOS).doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        uid,
        email,
        rol: 'usuario',
        fecha_registro: new Date(),
        fecha_nacimiento: null,
      });
    }

    res.json({ uid, email, rol: userDoc.exists ? userDoc.data().rol : 'usuario' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al verificar usuario' });
  }
});

// POST /api/auth/register-device
// Registra el dispositivo del usuario
router.post('/register-device', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id_dispositivo, nombre_dispositivo, plataforma, version } = req.body;

    if (!id_dispositivo || !plataforma) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    await db.collection(COL_REGISTRO_DISPOSITIVOS).doc(id_dispositivo).set({
      id_dispositivo,
      uid,
      nombre_dispositivo: nombre_dispositivo || '',
      plataforma,
      version: version || '',
      ultima_actividad: new Date(),
    }, { merge: true });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar dispositivo' });
  }
});

module.exports = router;
