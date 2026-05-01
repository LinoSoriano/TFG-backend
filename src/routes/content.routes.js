const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const contentService = require('../services/content.service');

// GET /api/content/version
// Devuelve la versión de contenido actual (sin autenticación)
router.get('/version', async (req, res) => {
  try {
    const version = await contentService.getLatestVersion();
    if (!version) {
      return res.status(404).json({ error: 'No hay versión disponible' });
    }
    res.json(version);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener versión' });
  }
});

// GET /api/content/package
// Devuelve el paquete de contenido completo para sincronización (sin autenticación)
router.get('/package', async (req, res) => {
  try {
    const paquete = await contentService.getContentPackage();
    if (!paquete) {
      return res.status(404).json({ error: 'No hay paquete disponible' });
    }
    res.json(paquete);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener paquete de contenido' });
  }
});

// Las siguientes rutas requieren rol de gestor.
// Posible ampliación: panel de gestión para crear versiones y actualizar contenido sin acceder a Firestore directamente.

// POST /api/content/version
// Crea una nueva versión de contenido
router.post('/version', verifyToken, requireRole('gestor'), async (req, res) => {
  try {
    const { numero_version } = req.body;
    if (!numero_version) {
      return res.status(400).json({ error: 'Falta numero_version' });
    }
    const result = await contentService.createVersion(numero_version);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear versión' });
  }
});

// PUT /api/content/package
// Actualiza el paquete de contenido asociado a una versión
router.put('/package', verifyToken, requireRole('gestor'), async (req, res) => {
  try {
    const { id_version, payload_arbol, payload_guias, payload_herramientas, payload_traducciones } = req.body;
    if (!id_version) {
      return res.status(400).json({ error: 'Falta id_version' });
    }
    const result = await contentService.updateContentPackage({
      id_version,
      payload_arbol,
      payload_guias,
      payload_herramientas,
      payload_traducciones,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
});

module.exports = router;
