require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/firebase');

async function migrate() {
  console.log('Actualizando colección "idiomas" en Firestore...');

  const idiomas = [
    { id: 'es', codigo_lenguaje: 'es', nombre_lenguaje: 'Español' },
    { id: 'en', codigo_lenguaje: 'en', nombre_lenguaje: 'English' },
    { id: 'ca', codigo_lenguaje: 'ca', nombre_lenguaje: 'Català' },
    { id: 'da', codigo_lenguaje: 'da', nombre_lenguaje: 'Dansk' },
    { id: 'fr', codigo_lenguaje: 'fr', nombre_lenguaje: 'Français' },
    { id: 'no', codigo_lenguaje: 'no', nombre_lenguaje: 'Norsk' },
  ];

  await Promise.all(
    idiomas.map(({ id, ...data }) =>
      db.collection('idiomas').doc(id).set(data, { merge: true }),
    ),
  );

  console.log(`✅ ${idiomas.length} idiomas añadidos/actualizados en Firestore.`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
