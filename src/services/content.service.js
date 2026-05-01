const { db } = require('../config/firebase');
const {
  COL_VERSION, COL_NODOS_DECISION, COL_NODOS_OPCIONES, COL_EMERGENCIAS,
  COL_GUIAS, COL_PASOS_GUIA, COL_HERRAMIENTAS, COL_GUIA_HERRAMIENTA,
  COL_TRADUCCIONES, COL_IDIOMAS,
} = require('../config/collections');

async function getLatestVersion() {
  const snapshot = await db.collection(COL_VERSION).get();
  if (snapshot.empty) return null;

  // Ordenar por numero_version semántico — el seed usa string en fecha_version
  // y las versiones nuevas usan Timestamp, lo que hace que orderBy Firestore no sea fiable
  const docs = snapshot.docs.sort((a, b) => {
    const parse = (v) => (v || '0.0.0').split('.').map(Number);
    const va = parse(a.data().numero_version);
    const vb = parse(b.data().numero_version);
    for (let i = 0; i < 3; i++) {
      if (va[i] !== vb[i]) return vb[i] - va[i];
    }
    return 0;
  });

  const doc = docs[0];
  const data = doc.data();
  // Normalizar fecha_version a string — puede ser Timestamp (versiones vía API)
  // o string '2026-03-12' (seed). El frontend hace `as String?` y petaría con un objeto.
  const fechaVersion = data.fecha_version;
  const fechaStr = fechaVersion && typeof fechaVersion.toDate === 'function'
    ? fechaVersion.toDate().toISOString()
    : String(fechaVersion ?? '');
  return { id_version: doc.id, ...data, fecha_version: fechaStr };
}

async function getContentPackage() {
  // Lee las colecciones individuales en paralelo (no existe paquete_contenido)
  const [
    nodosSnap, opcionesSnap, emergenciasSnap,
    guiasSnap, pasosSnap, herramientasSnap,
    guiaHerramientaSnap, traduccionesSnap, idiomasSnap,
  ] = await Promise.all([
    db.collection(COL_NODOS_DECISION).get(),
    db.collection(COL_NODOS_OPCIONES).get(),
    db.collection(COL_EMERGENCIAS).get(),
    db.collection(COL_GUIAS).get(),
    db.collection(COL_PASOS_GUIA).get(),
    db.collection(COL_HERRAMIENTAS).get(),
    db.collection(COL_GUIA_HERRAMIENTA).get(),
    db.collection(COL_TRADUCCIONES).get(),
    db.collection(COL_IDIOMAS).get(),
  ]);

  // Mapeo Firestore → nombres de columna SQLite que espera el frontend
  const nodos = nodosSnap.docs.map(doc => ({
    id_nodo:       parseInt(doc.id),
    pregunta_nodo: doc.data().pregunta,
    id_version:    doc.data().id_version    ?? null,
    nodo_anterior: doc.data().nodo_anterior ?? null,
  }));

  const opciones = opcionesSnap.docs.map(doc => ({
    id_opcion:             parseInt(doc.id),
    id_nodo:               doc.data().id_nodo,
    texto_opcion:          doc.data().texto,
    nodo_siguiente:        doc.data().nodo_siguiente        ?? null,
    emergencia_resultante: doc.data().emergencia_resultante ?? null,
  }));

  const emergencias = emergenciasSnap.docs.map(doc => ({
    id_emergencia:         parseInt(doc.id),
    titulo_emergencia:     doc.data().titulo,
    descripcion_emergencia:doc.data().descripcion,
    informacion_especifica:doc.data().informacion_especifica ?? null,
    version_id:            doc.data().version_id            ?? null,
  }));

  const guias = guiasSnap.docs.map(doc => ({
    id_guia:        parseInt(doc.id),
    id_emergencia:  doc.data().id_emergencia,
    titulo_guia:    doc.data().titulo,
    descripcion_guia:doc.data().descripcion,
    categoria_key:  doc.data().categoria_key,
    version_id:     doc.data().version_id ?? null,
  }));

  const pasos = pasosSnap.docs.map(doc => ({
    id_paso:       parseInt(doc.id),
    id_guia:       doc.data().id_guia,
    titulo_paso:   doc.data().titulo,
    contenido_paso:doc.data().contenido,
    orden_paso:    doc.data().orden,
  }));

  const herramientas = herramientasSnap.docs.map(doc => ({
    id_herramienta:        parseInt(doc.id),
    nombre_herramienta:    doc.data().nombre,
    descripcion_herramienta:doc.data().descripcion,
    version_id:            doc.data().version_id ?? null,
  }));

  const guiaHerramienta = guiaHerramientaSnap.docs.map(doc => ({
    id_guia:       doc.data().id_guia,
    id_herramienta:doc.data().id_herramienta,
    orden:         doc.data().orden,
    tipo_relacion: doc.data().tipo_relacion,
  }));

  // Construir payload_traducciones desde la colección traducciones
  // Solo se incluyen documentos con id_texto numérico (los creados por el seed/API).
  // Los creados por el panel admin sin id_texto se omiten para evitar fallos en el sync móvil.
  const textos = [];
  const traducciones = [];
  for (const doc of traduccionesSnap.docs) {
    const data = doc.data();
    if (data.id_texto == null) continue;
    textos.push({
      id_texto:     data.id_texto,
      nombre_texto: data.nombre_texto,
      contexto:     data.contexto ?? null,
      version:      data.version ?? '1.0.0',
    });
    for (const [codigoLenguaje, textoTraducido] of Object.entries(data.traducciones ?? {})) {
      traducciones.push({
        nombre_texto:    data.nombre_texto,
        codigo_lenguaje: codigoLenguaje,
        texto_traducido: textoTraducido,
        version:         data.version ?? '1.0.0',
      });
    }
  }

  const idiomas = idiomasSnap.docs.map(doc => ({
    codigo_lenguaje: doc.data().codigo_lenguaje,
    nombre_lenguaje: doc.data().nombre_lenguaje,
  }));

  return {
    payload_idiomas:      idiomas,
    payload_arbol:        { nodos, opciones },
    payload_guias:        { emergencias, guias, pasos },
    payload_herramientas: { herramientas, guia_herramienta: guiaHerramienta },
    payload_traducciones: { textos, traducciones },
  };
}

async function createVersion(numero_version) {
  const fecha_version = new Date();
  const docRef = await db.collection(COL_VERSION).add({ numero_version, fecha_version });
  return { id_version: docRef.id, numero_version, fecha_version };
}

async function updateContentPackage({ id_version, payload_arbol, payload_guias, payload_herramientas, payload_traducciones }) {
  const versionDoc = await db.collection(COL_VERSION).doc(id_version).get();
  if (!versionDoc.exists) {
    const err = new Error(`Versión ${id_version} no encontrada`);
    err.status = 404;
    throw err;
  }

  // Acumula todas las escrituras y las ejecuta en lotes de 499 (límite de Firestore)
  const ops = [];
  const push = (col, id, data) => ops.push({ ref: db.collection(col).doc(String(id)), data });

  if (payload_arbol?.nodos) {
    for (const n of payload_arbol.nodos) {
      push(COL_NODOS_DECISION, n.id_nodo, { pregunta: n.pregunta_nodo, id_version: n.id_version ?? null, nodo_anterior: n.nodo_anterior ?? null });
    }
  }
  if (payload_arbol?.opciones) {
    for (const o of payload_arbol.opciones) {
      push(COL_NODOS_OPCIONES, o.id_opcion, { id_nodo: o.id_nodo, texto: o.texto_opcion, nodo_siguiente: o.nodo_siguiente ?? null, emergencia_resultante: o.emergencia_resultante ?? null });
    }
  }
  if (payload_guias?.emergencias) {
    for (const e of payload_guias.emergencias) {
      push(COL_EMERGENCIAS, e.id_emergencia, { titulo: e.titulo_emergencia, descripcion: e.descripcion_emergencia, informacion_especifica: e.informacion_especifica ?? null, version_id: e.version_id ?? null });
    }
  }
  if (payload_guias?.guias) {
    for (const g of payload_guias.guias) {
      push(COL_GUIAS, g.id_guia, { id_emergencia: g.id_emergencia, titulo: g.titulo_guia, descripcion: g.descripcion_guia, categoria_key: g.categoria_key, version_id: g.version_id ?? null });
    }
  }
  if (payload_guias?.pasos) {
    for (const p of payload_guias.pasos) {
      push(COL_PASOS_GUIA, p.id_paso, { id_guia: p.id_guia, titulo: p.titulo_paso, contenido: p.contenido_paso, orden: p.orden_paso });
    }
  }
  if (payload_herramientas?.herramientas) {
    for (const h of payload_herramientas.herramientas) {
      push(COL_HERRAMIENTAS, h.id_herramienta, { nombre: h.nombre_herramienta, descripcion: h.descripcion_herramienta, version_id: h.version_id ?? null });
    }
  }
  if (payload_traducciones?.textos) {
    const map = {};
    for (const t of payload_traducciones.textos) {
      map[t.nombre_texto] = { id_texto: t.id_texto, nombre_texto: t.nombre_texto, contexto: t.contexto ?? null, version: t.version ?? '1.0.0', traducciones: {} };
    }
    for (const t of payload_traducciones.traducciones ?? []) {
      if (map[t.nombre_texto]) map[t.nombre_texto].traducciones[t.codigo_lenguaje] = t.texto_traducido;
    }
    for (const data of Object.values(map)) {
      push(COL_TRADUCCIONES, data.id_texto, data);
    }
  }

  for (let i = 0; i < ops.length; i += 499) {
    const batch = db.batch();
    for (const { ref, data } of ops.slice(i, i + 499)) batch.set(ref, data, { merge: true });
    await batch.commit();
  }

  return { ok: true, id_version, escrituras: ops.length };
}

module.exports = { getLatestVersion, getContentPackage, createVersion, updateContentPackage };
