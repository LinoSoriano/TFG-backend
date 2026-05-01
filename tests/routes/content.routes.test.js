const request = require('supertest');

// ── Mocks ───────────────────────────────────────────────────────────────────
jest.mock('../../src/config/firebase', () => ({ db: {}, auth: {} }));

// El mock de content.service expone funciones jest.fn() que configuramos por test
jest.mock('../../src/services/content.service');
const contentService = require('../../src/services/content.service');

// Mock del middleware: por defecto autentica como "usuario"
let mockRole = 'usuario';
jest.mock('../../src/middleware/auth', () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { uid: 'uid-test' };
    next();
  }),
  requireRole: jest.fn((role) => (req, res, next) => {
    if (mockRole === role) return next();
    res.status(403).json({ error: 'Acceso denegado' });
  }),
}));

const app = require('../../src/app');

// ─────────────────────────────────────────────
//  GET /api/content/version
// ─────────────────────────────────────────────
describe('GET /api/content/version', () => {
  test('404 cuando no hay versión disponible', async () => {
    contentService.getLatestVersion.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/content/version');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('200 con los datos de versión', async () => {
    contentService.getLatestVersion.mockResolvedValueOnce({ id_version: 'v1', numero_version: '1.5.0', fecha_version: '2026-01-01' });
    const res = await request(app).get('/api/content/version');
    expect(res.status).toBe(200);
    expect(res.body.numero_version).toBe('1.5.0');
  });

  test('500 cuando el servicio lanza un error', async () => {
    contentService.getLatestVersion.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/api/content/version');
    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────────
//  GET /api/content/package
// ─────────────────────────────────────────────
describe('GET /api/content/package', () => {
  test('404 cuando no hay paquete', async () => {
    contentService.getContentPackage.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/content/package');
    expect(res.status).toBe(404);
  });

  test('200 con el paquete completo', async () => {
    const paquete = { payload_arbol: {}, payload_guias: {}, payload_herramientas: {}, payload_traducciones: {} };
    contentService.getContentPackage.mockResolvedValueOnce(paquete);
    const res = await request(app).get('/api/content/package');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('payload_arbol');
  });
});

// ─────────────────────────────────────────────
//  POST /api/content/version  (requiere rol gestor)
// ─────────────────────────────────────────────
describe('POST /api/content/version', () => {
  test('403 cuando el usuario no tiene rol gestor', async () => {
    mockRole = 'usuario';
    const res = await request(app).post('/api/content/version').send({ numero_version: '2.0.0' });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Acceso denegado');
  });

  test('400 cuando falta numero_version', async () => {
    mockRole = 'gestor';
    const res = await request(app).post('/api/content/version').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('201 con la nueva versión creada', async () => {
    mockRole = 'gestor';
    contentService.createVersion.mockResolvedValueOnce({ id_version: 'new-id', numero_version: '2.0.0', fecha_version: new Date() });
    const res = await request(app).post('/api/content/version').send({ numero_version: '2.0.0' });
    expect(res.status).toBe(201);
    expect(res.body.numero_version).toBe('2.0.0');
  });
});

// ─────────────────────────────────────────────
//  PUT /api/content/package  (requiere rol gestor)
// ─────────────────────────────────────────────
describe('PUT /api/content/package', () => {
  test('403 cuando el usuario no tiene rol gestor', async () => {
    mockRole = 'usuario';
    const res = await request(app).put('/api/content/package').send({ id_version: 'v1' });
    expect(res.status).toBe(403);
  });

  test('400 cuando falta id_version', async () => {
    mockRole = 'gestor';
    const res = await request(app).put('/api/content/package').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('200 con { ok: true } al actualizar correctamente', async () => {
    mockRole = 'gestor';
    contentService.updateContentPackage.mockResolvedValueOnce({ ok: true, id_version: 'v1', escrituras: 10 });
    const res = await request(app).put('/api/content/package').send({ id_version: 'v1' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
