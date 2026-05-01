const request = require('supertest');

// ── Mocks ───────────────────────────────────────────────────────────────────
const mockUserDoc = { exists: false, data: () => null };
const mockUserRef = {
  get: jest.fn().mockResolvedValue(mockUserDoc),
  set: jest.fn().mockResolvedValue({}),
};
const mockDeviceRef = { set: jest.fn().mockResolvedValue({}) };

const mockDb = {
  collection: jest.fn().mockImplementation((col) => ({
    doc: jest.fn().mockReturnValue(col === 'usuarios' ? mockUserRef : mockDeviceRef),
  })),
};

jest.mock('../../src/config/firebase', () => ({ db: mockDb, auth: {} }));

jest.mock('../../src/middleware/auth', () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { uid: 'uid-test', email: 'test@example.com' };
    next();
  }),
  requireRole: jest.fn(() => (req, res, next) => next()),
}));

const app = require('../../src/app');

// ─────────────────────────────────────────────
//  POST /api/auth/verify
// ─────────────────────────────────────────────
describe('POST /api/auth/verify', () => {
  test('crea el usuario en Firestore si no existe y devuelve rol "usuario"', async () => {
    mockUserDoc.exists = false;
    const res = await request(app).post('/api/auth/verify').send();
    expect(res.status).toBe(200);
    expect(res.body.uid).toBe('uid-test');
    expect(res.body.rol).toBe('usuario');
    expect(mockUserRef.set).toHaveBeenCalled();
  });

  test('no crea el usuario si ya existe y devuelve su rol', async () => {
    mockUserDoc.exists = true;
    mockUserDoc.data = () => ({ rol: 'gestor' });
    mockUserRef.set.mockClear();
    const res = await request(app).post('/api/auth/verify').send();
    expect(res.status).toBe(200);
    expect(res.body.rol).toBe('gestor');
    expect(mockUserRef.set).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
//  POST /api/auth/register-device
// ─────────────────────────────────────────────
describe('POST /api/auth/register-device', () => {
  test('400 cuando falta id_dispositivo', async () => {
    const res = await request(app)
      .post('/api/auth/register-device')
      .send({ plataforma: 'android' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('400 cuando falta plataforma', async () => {
    const res = await request(app)
      .post('/api/auth/register-device')
      .send({ id_dispositivo: 'device-abc' });
    expect(res.status).toBe(400);
  });

  test('200 con { ok: true } cuando los campos son correctos', async () => {
    const res = await request(app)
      .post('/api/auth/register-device')
      .send({ id_dispositivo: 'device-abc', plataforma: 'android', version: '1.5.0' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(mockDeviceRef.set).toHaveBeenCalled();
  });
});
