const mockVerifyIdToken = jest.fn();
const mockGetUser = jest.fn();

jest.mock('../../src/config/firebase', () => ({
  auth: { verifyIdToken: mockVerifyIdToken, getUser: mockGetUser },
  db: {},
}));

const { verifyToken, requireRole } = require('../../src/middleware/auth');

// Helper: crea req/res/next simulados
function makeCtx(headers = {}) {
  const req = { headers, user: undefined };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
}

// ─────────────────────────────────────────────
//  verifyToken
// ─────────────────────────────────────────────
describe('verifyToken', () => {
  test('401 cuando no hay cabecera Authorization', async () => {
    const { req, res, next } = makeCtx();
    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token no proporcionado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('401 cuando la cabecera no empieza por "Bearer "', async () => {
    const { req, res, next } = makeCtx({ authorization: 'Basic abc123' });
    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('401 cuando el token es inválido o expirado', async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error('Token expired'));
    const { req, res, next } = makeCtx({ authorization: 'Bearer token-invalido' });
    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('llama a next() y asigna req.user cuando el token es válido', async () => {
    const decodedUser = { uid: 'uid-123', email: 'user@test.com' };
    mockVerifyIdToken.mockResolvedValueOnce(decodedUser);
    const { req, res, next } = makeCtx({ authorization: 'Bearer token-valido' });
    await verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(decodedUser);
  });
});

// ─────────────────────────────────────────────
//  requireRole
// ─────────────────────────────────────────────
describe('requireRole', () => {
  test('401 cuando req.user no está definido', async () => {
    const { req, res, next } = makeCtx();
    req.user = undefined;
    await requireRole('gestor')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No autenticado' });
  });

  test('403 cuando el usuario tiene rol incorrecto', async () => {
    mockGetUser.mockResolvedValueOnce({ customClaims: { rol: 'usuario' } });
    const { req, res, next } = makeCtx();
    req.user = { uid: 'uid-123' };
    await requireRole('gestor')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acceso denegado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('403 cuando el usuario no tiene customClaims', async () => {
    mockGetUser.mockResolvedValueOnce({ customClaims: null });
    const { req, res, next } = makeCtx();
    req.user = { uid: 'uid-123' };
    await requireRole('gestor')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('500 cuando getUser lanza un error', async () => {
    mockGetUser.mockRejectedValueOnce(new Error('Firebase error'));
    const { req, res, next } = makeCtx();
    req.user = { uid: 'uid-123' };
    await requireRole('gestor')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al verificar rol' });
  });

  test('llama a next() cuando el rol es correcto', async () => {
    mockGetUser.mockResolvedValueOnce({ customClaims: { rol: 'gestor' } });
    const { req, res, next } = makeCtx();
    req.user = { uid: 'uid-123' };
    await requireRole('gestor')(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
