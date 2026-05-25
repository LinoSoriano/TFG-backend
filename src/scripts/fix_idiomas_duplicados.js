require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/firebase');

async function fix() {
  console.log('Buscando duplicados en la colección "idiomas"...');

  const snapshot = await db.collection('idiomas').get();

  // Agrupar documentos por codigo_lenguaje
  const porCodigo = {};
  snapshot.forEach((doc) => {
    const codigo = doc.data().codigo_lenguaje;
    if (!porCodigo[codigo]) porCodigo[codigo] = [];
    porCodigo[codigo].push({ id: doc.id, data: doc.data() });
  });

  let eliminados = 0;
  for (const [codigo, docs] of Object.entries(porCodigo)) {
    if (docs.length > 1) {
      // Mantener el doc cuyo ID coincide con el código (es, en, no...), eliminar el resto
      const conservar = docs.find((d) => d.id === codigo) ?? docs[0];
      const duplicados = docs.filter((d) => d.id !== conservar.id);
      console.log(`  [${codigo}] ${docs.length} docs → conservo "${conservar.id}", elimino: ${duplicados.map((d) => d.id).join(', ')}`);
      for (const dup of duplicados) {
        await db.collection('idiomas').doc(dup.id).delete();
        eliminados++;
      }
    }
  }

  if (eliminados === 0) {
    console.log('No se encontraron duplicados.');
  } else {
    console.log(`✅ ${eliminados} documento(s) duplicado(s) eliminado(s).`);
  }
  process.exit(0);
}

fix().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
