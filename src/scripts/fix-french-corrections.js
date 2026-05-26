/**
 * Correcciones puntuales de traducciones francesas en Firestore.
 * Actualiza únicamente el campo traducciones.fr de los 13 documentos afectados.
 * Ejecutar una sola vez: node src/scripts/fix-french-corrections.js
 */
require('dotenv').config();
const { db } = require('../config/firebase');

const corrections = [
  {
    id: '11',
    fr: 'Localisation exacte de l\'hémorragie\nIntensité du saignement (abondant, en jets...)\nSi vous avez appliqué une pression directe sur la blessure\nSi la personne montre des signes de choc (pâleur, sueurs froides, tremblements)',
  },
  {
    id: '15',
    fr: 'Affaissement d\'un côté du visage\nQuand les symptômes ont commencé (CRITIQUE)\nS\'il y a des difficultés à parler ou à comprendre\nS\'il y a une faiblesse dans le bras ou la jambe',
  },
  {
    id: '19',
    fr: 'Douleur intense dans la poitrine, oppression ou forte pression\nCombien de temps la douleur dure\nSi la douleur irradie vers le bras, le cou ou la mâchoire\nS\'il y a des sueurs froides, nausées ou difficultés respiratoires',
  },
  {
    id: '21',
    fr: 'La victime s\'étouffe (incapacité de parler)\nSi elle peut tousser ou parler (obstruction partielle vs totale)\nSi la manœuvre de Heimlich a déjà été commencée\nSi elle présente une coloration bleutée (cyanose)',
  },
  {
    id: '24',
    fr: 'Durée des convulsions\nSi c\'est la première fois ou s\'il a des antécédents d\'épilepsie\nS\'il a perdu conscience\nS\'il y a des blessures après la convulsion',
  },
  {
    id: '27',
    fr: 'La victime ne respire PAS ou respire de façon anormale\nEst inconsciente, ne répond pas aux stimules\nSi vous avez commencé ou allez commencer la RCP (30 compressions / 2 ventilations)\nS\'il y a un DAE (défibrillateur) disponible à proximité',
  },
  {
    id: '31',
    fr: 'La victime se trouve inconsciente mais respire\nA déjà été placée en Position Latérale de Sécurité (PLS)\ncombien de temps elle a perdu connaissance\nS\'il y a des blessures visibles (coups à la tête, saignement, etc.)',
  },
  {
    id: '69',
    fr: 'Se préparer à commencer la RCP en cas de perte de conscience',
  },
  {
    id: '79',
    fr: 'Ne pas attendre : le temps est CRITIQUE pour limiter les dommages cérébraux',
  },
  {
    id: '85',
    fr: 'Après la convulsion, placer la victime sur le côté',
  },
  {
    id: '99',
    fr: 'Élever le membre blessé si possible et SEULEMENT en l\'absence de fracture',
  },
  {
    id: '129',
    fr: 'PAS RACCROCHEZ S.V.P. Restez en ligne et suivez les instructions de l\'opérateur.',
  },
  {
    id: '132',
    fr: 'Localisation exacte : coordonnées, ville et points de repère',
  },
];

async function run() {
  const batch = db.batch();
  for (const { id, fr } of corrections) {
    const ref = db.collection('traducciones').doc(id);
    batch.update(ref, { 'traducciones.fr': fr });
  }
  await batch.commit();
  console.log(`✓ ${corrections.length} traducciones FR actualizadas en Firestore`);
}

run().catch((err) => { console.error(err); process.exit(1); });
