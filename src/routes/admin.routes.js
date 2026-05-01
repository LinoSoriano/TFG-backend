const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { assignRole, getIdiomas, createIdioma } = require('../services/admin.service');

router.post('/assign-role', verifyToken, requireRole('gestor'), async (req, res) => {
  const { uid, rol } = req.body;
  if (!uid || !rol) return res.status(400).json({ error: 'uid y rol son requeridos' });
  try {
    await assignRole(uid, rol);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al asignar rol' });
  }
});

router.get('/idiomas', verifyToken, requireRole('gestor'), async (req, res) => {
  try {
    const idiomas = await getIdiomas();
    res.json(idiomas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener idiomas' });
  }
});

router.post('/idiomas', verifyToken, requireRole('gestor'), async (req, res) => {
  const { codigo_lenguaje, nombre_lenguaje } = req.body;
  if (!codigo_lenguaje || !nombre_lenguaje) {
    return res.status(400).json({ error: 'codigo_lenguaje y nombre_lenguaje son requeridos' });
  }
  try {
    const idioma = await createIdioma(codigo_lenguaje, nombre_lenguaje);
    res.status(201).json(idioma);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear idioma' });
  }
});

module.exports = router;
