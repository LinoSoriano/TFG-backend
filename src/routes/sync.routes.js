const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');
const { COL_REGISTRO_SINCRONIZACIONES } = require('../config/collections');

// POST /api/sync/log
// Registra una operación de sincronización del dispositivo.
// Posible ampliación: panel de gestión para visualizar actividad de sincronización por dispositivo.
router.post('/log', verifyToken, async (req, res) => {
  try {
    const { tipo_sincronizacion, id_dispositivo } = req.body;

    if (!tipo_sincronizacion) {
      return res.status(400).json({ error: 'Falta tipo_sincronizacion' });
    }

    const docRef = await db.collection(COL_REGISTRO_SINCRONIZACIONES).add({
      uid: req.user.uid,
      id_dispositivo: id_dispositivo || null,
      tipo_sincronizacion,
      momento: new Date(),
    });

    res.status(201).json({ id_sincronizacion: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar sincronización' });
  }
});

module.exports = router;
