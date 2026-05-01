// Helpers para construir snapshots de Firestore simulados
function snap(docs = []) {
  return {
    empty: docs.length === 0,
    docs: docs.map(([id, data]) => ({ id: String(id), data: () => data })),
  };
}

function docSnap(data = null) {
  return { exists: data !== null, data: () => data, id: 'mock-id' };
}

// ── Mock de Firestore ──────────────────────────────────────────────────────
const mockBatch = {
  set: jest.fn(),
  commit: jest.fn().mockResolvedValue({}),
};

// mockDb.collection devuelve un objeto fresco por cada llamada usando el nombre
// de la colección para poder devolver datos distintos por colección.
const collectionData = {};
const mockDb = {
  collection: jest.fn().mockImplementation((col) => ({
    get: jest.fn().mockResolvedValue(collectionData[col] ?? snap()),
    doc: jest.fn().mockImplementation((id) => ({
      get: jest.fn().mockResolvedValue(collectionData[`${col}/${id}`] ?? docSnap(null)),
      set: jest.fn().mockResolvedValue({}),
      id,
    })),
    add: jest.fn().mockResolvedValue({ id: 'new-doc-id' }),
  })),
  batch: jest.fn().mockReturnValue(mockBatch),
};

jest.mock('../../src/config/firebase', () => ({ db: mockDb, auth: {} }));

const {
  getLatestVersion,
  getContentPackage,
  createVersion,
  updateContentPackage,
} = require('../../src/services/content.service');

// ─────────────────────────────────────────────
//  getLatestVersion
// ─────────────────────────────────────────────
describe('getLatestVersion', () => {
  test('devuelve null cuando no hay versiones', async () => {
    collectionData['version_contenido'] = snap();
    const result = await getLatestVersion();
    expect(result).toBeNull();
  });

  test('devuelve la versión correcta cuando solo hay una', async () => {
    collectionData['version_contenido'] = snap([['id-v1', { numero_version: '1.0.0', fecha_version: '2026-01-01' }]]);
    const result = await getLatestVersion();
    expect(result).toMatchObject({ id_version: 'id-v1', numero_version: '1.0.0' });
  });

  test('ordena semánticamente y devuelve la versión más alta', async () => {
    collectionData['version_contenido'] = snap([
      ['id-v1', { numero_version: '1.0.0', fecha_version: '2026-01-01' }],
      ['id-v2', { numero_version: '1.10.0', fecha_version: '2026-02-01' }],
      ['id-v3', { numero_version: '1.9.0', fecha_version: '2026-03-01' }],
    ]);
    const result = await getLatestVersion();
    expect(result.numero_version).toBe('1.10.0');
  });

  test('normaliza Timestamp de Firebase a string ISO', async () => {
    const fakeTimestamp = { toDate: () => new Date('2026-04-01T12:00:00.000Z') };
    collectionData['version_contenido'] = snap([['id-v1', { numero_version: '1.0.0', fecha_version: fakeTimestamp }]]);
    const result = await getLatestVersion();
    expect(typeof result.fecha_version).toBe('string');
    expect(result.fecha_version).toContain('2026-04-01');
  });
});

// ─────────────────────────────────────────────
//  getContentPackage — mapeo de campos
// ─────────────────────────────────────────────
describe('getContentPackage — mapeo de campos', () => {
  beforeEach(() => {
    // Datos mínimos para que Promise.all resuelva
    collectionData['nodos_decision']  = snap([['1', { pregunta: '¿Respira?', id_version: null, nodo_anterior: null }]]);
    collectionData['nodos_opciones']  = snap([['1', { id_nodo: 1, texto: 'Sí', nodo_siguiente: 2, emergencia_resultante: null }]]);
    collectionData['emergencias']     = snap([['1', { titulo: 'PCR', descripcion: 'Parada cardiorrespiratoria', informacion_especifica: null, version_id: null }]]);
    collectionData['guias']           = snap([['1', { id_emergencia: 1, titulo: 'Guía PCR', descripcion: 'Desc', categoria_key: 'rcp', version_id: null }]]);
    collectionData['pasos_guias']     = snap([['1', { id_guia: 1, titulo: 'Paso 1', contenido: 'Llama al 112', orden: 1 }]]);
    collectionData['herramientas']    = snap([['1', { nombre: 'RCP', descripcion: 'Asistente RCP', version_id: null }]]);
    collectionData['guia_herramienta']= snap([['1', { id_guia: 1, id_herramienta: 1, orden: 1, tipo_relacion: 'principal' }]]);
    collectionData['traducciones']    = snap([['1', { id_texto: 1, nombre_texto: 'ui.llamar112', contexto: null, version: '1.0.0', traducciones: { es: '¡LLAMA AL 112!', en: 'CALL 112!' } }]]);
    collectionData['idiomas']         = snap([['1', { codigo_lenguaje: 'es', nombre_lenguaje: 'Español' }]]);
  });

  test('mapea nodos_decision: id_nodo, pregunta_nodo', async () => {
    const paquete = await getContentPackage();
    const nodo = paquete.payload_arbol.nodos[0];
    expect(nodo.id_nodo).toBe(1);
    expect(nodo.pregunta_nodo).toBe('¿Respira?');
  });

  test('mapea nodos_opciones: texto_opcion', async () => {
    const paquete = await getContentPackage();
    const opcion = paquete.payload_arbol.opciones[0];
    expect(opcion.texto_opcion).toBe('Sí');
    expect(opcion.id_nodo).toBe(1);
  });

  test('mapea emergencias: titulo_emergencia, descripcion_emergencia', async () => {
    const paquete = await getContentPackage();
    const em = paquete.payload_guias.emergencias[0];
    expect(em.titulo_emergencia).toBe('PCR');
    expect(em.descripcion_emergencia).toBe('Parada cardiorrespiratoria');
  });

  test('mapea pasos_guias: contenido_paso, orden_paso', async () => {
    const paquete = await getContentPackage();
    const paso = paquete.payload_guias.pasos[0];
    expect(paso.contenido_paso).toBe('Llama al 112');
    expect(paso.orden_paso).toBe(1);
  });

  test('descompone traducciones en textos[] y traducciones[]', async () => {
    const paquete = await getContentPackage();
    const { textos, traducciones } = paquete.payload_traducciones;
    expect(textos[0].nombre_texto).toBe('ui.llamar112');
    expect(traducciones.some(t => t.codigo_lenguaje === 'es')).toBe(true);
    expect(traducciones.some(t => t.codigo_lenguaje === 'en')).toBe(true);
  });

  test('incluye payload_idiomas con codigo_lenguaje', async () => {
    const paquete = await getContentPackage();
    expect(paquete.payload_idiomas[0].codigo_lenguaje).toBe('es');
  });
});

// ─────────────────────────────────────────────
//  createVersion
// ─────────────────────────────────────────────
describe('createVersion', () => {
  test('crea el documento y devuelve id_version + numero_version', async () => {
    const result = await createVersion('2.0.0');
    expect(result.id_version).toBe('new-doc-id');
    expect(result.numero_version).toBe('2.0.0');
    expect(result.fecha_version).toBeInstanceOf(Date);
  });
});

// ─────────────────────────────────────────────
//  updateContentPackage
// ─────────────────────────────────────────────
describe('updateContentPackage', () => {
  test('lanza error 404 cuando la versión no existe', async () => {
    collectionData['version_contenido/id-inexistente'] = docSnap(null);
    await expect(
      updateContentPackage({ id_version: 'id-inexistente' })
    ).rejects.toMatchObject({ message: expect.stringContaining('id-inexistente') });
  });

  test('ejecuta batch.commit() y devuelve ok:true cuando la versión existe', async () => {
    collectionData['version_contenido/id-v1'] = docSnap({ numero_version: '1.0.0' });
    const result = await updateContentPackage({
      id_version: 'id-v1',
      payload_arbol: {
        nodos: [{ id_nodo: 1, pregunta_nodo: '¿Respira?', id_version: null, nodo_anterior: null }],
        opciones: [],
      },
    });
    expect(mockBatch.commit).toHaveBeenCalled();
    expect(result.ok).toBe(true);
    expect(result.id_version).toBe('id-v1');
  });

  test('reporta el número de escrituras realizadas', async () => {
    collectionData['version_contenido/id-v1'] = docSnap({ numero_version: '1.0.0' });
    const result = await updateContentPackage({
      id_version: 'id-v1',
      payload_arbol: {
        nodos:   [{ id_nodo: 1, pregunta_nodo: 'P1', id_version: null, nodo_anterior: null },
                  { id_nodo: 2, pregunta_nodo: 'P2', id_version: null, nodo_anterior: null }],
        opciones: [{ id_opcion: 1, id_nodo: 1, texto_opcion: 'Sí', nodo_siguiente: null, emergencia_resultante: null }],
      },
    });
    expect(result.escrituras).toBe(3); // 2 nodos + 1 opción
  });
});
