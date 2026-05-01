const request = require('supertest');

// ── Mocks ───────────────────────────────────────────────────────────────────
const mockAdd = jest.fn().mockResolvedValue({ id: 'sync-doc-id' });
const mockDb = {
  collection: jest.fn().mockReturnValue({ add: mockAdd }),
};

jest.mock('../../src/config/firebase', () => ({ db: mockDb, auth: {} }));

jest.mock('../../src/middleware/auth', () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { uid: 'uid-test' };
    next();
  }),
  requireRole: jest.fn(() => (req, res, next) => next()),
}));

const app = require('../../src/app');

// ─────────────────────────────────────────────
//  POST /api/sync/log
// ─────────────────────────────────────────────
describe('POST /api/sync/log', () => {
  test('400 cuando falta tipo_sincronizacion', async () => {
    const res = await request(app)
      .post('/api/sync/log')
      .send({ id_dispositivo: 'device-abc' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('201 con id_sincronizacion cuando los datos son correctos', async () => {
    const res = await request(app)
      .post('/api/sync/log')
      .send({ tipo_sincronizacion: 'completa', id_dispositivo: 'device-abc' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id_sincronizacion', 'sync-doc-id');
  });

  test('guarda uid del usuario autenticado en el documento', async () => {
    await request(app)
      .post('/api/sync/log')
      .send({ tipo_sincronizacion: 'completa' });
    const docGuardado = mockAdd.mock.calls[0][0];
    expect(docGuardado.uid).toBe('uid-test');
  });

  test('acepta id_dispositivo como opcional (null cuando no se envía)', async () => {
    await request(app)
      .post('/api/sync/log')
      .send({ tipo_sincronizacion: 'version' });
    const docGuardado = mockAdd.mock.calls[mockAdd.mock.calls.length - 1][0];
    expect(docGuardado.id_dispositivo).toBeNull();
  });
});
