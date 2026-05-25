require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/firebase');

async function migrate() {
  console.log('Añadiendo claves de herramientas 8 y 9 (IDs 213-216) en Firestore...');

  const trad = (id, nombre, contexto, esText, enText, noText, frText, caText, daText) =>
    db.collection('traducciones').doc(String(id)).set(
      {
        id_texto: id,
        nombre_texto: nombre,
        contexto,
        version: '1.0.0',
        traducciones: { es: esText, en: enText, no: noText, fr: frText, ca: caText, da: daText },
      },
      { merge: true },
    );

  await Promise.all([
    trad(213, 'herramienta.8.nombre', 'herramienta',
      'Maniobra de Heimlich',
      'Heimlich Maneuver',
      'Heimlich-manøver',
      'Manœuvre de Heimlich',
      'Maniobra de Heimlich',
      'Heimlich-manøvre'),
    trad(214, 'herramienta.8.descripcion', 'herramienta',
      'Protocolo paso a paso para actuar ante un atragantamiento en adultos, niños y bebés',
      'Step-by-step protocol for choking in adults, children and babies',
      'Trinnvis protokoll for kvelning hos voksne, barn og spedbarn',
      "Protocole étape par étape pour une obstruction chez adultes, enfants et bébés",
      'Protocol pas a pas per actuar davant un ofegament en adults, nens i nadons',
      'Trin-for-trin protokol til håndtering af kvælning hos voksne, børn og babyer'),
    trad(215, 'herramienta.9.nombre', 'herramienta',
      'Guía de quemaduras',
      'Burns Guide',
      'Brannskadeguide',
      'Guide des brûlures',
      'Guia de cremades',
      'Brandguide'),
    trad(216, 'herramienta.9.descripcion', 'herramienta',
      'Identifica el grado (1.º, 2.º, 3.er) y sigue el protocolo de actuación adecuado',
      'Identify the degree (1st, 2nd, 3rd) and follow the appropriate action protocol',
      'Identifiser graden (1., 2., 3.) og følg riktig handlingsprotokoll',
      "Identifiez le degré (1er, 2e, 3e) et suivez le protocole d'action approprié",
      'Identifica el grau (1r, 2n, 3r) i segueix el protocol d\'actuació adequat',
      'Identificer graden (1., 2., 3.) og følg den korrekte handlingsprotokol'),
  ]);

  console.log('✅ 4 claves (213-216) de herramientas 8 y 9 añadidas/actualizadas en Firestore.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
