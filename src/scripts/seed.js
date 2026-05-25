require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/firebase');

async function seed() {
  console.log('Iniciando seed de Firestore...');

  const batch1 = db.batch();

  // ─── VERSION CONTENIDO ────────────────────────────────────────────────────
  batch1.set(db.collection('version_contenido').doc('1'), {
    numero_version: '1.5.0',
    fecha_version: '2026-04-25',
  });

  // ─── IDIOMAS ──────────────────────────────────────────────────────────────
  batch1.set(db.collection('idiomas').doc('es'), { codigo_lenguaje: 'es', nombre_lenguaje: 'Español' });
  batch1.set(db.collection('idiomas').doc('en'), { codigo_lenguaje: 'en', nombre_lenguaje: 'English' });
  batch1.set(db.collection('idiomas').doc('no'), { codigo_lenguaje: 'no', nombre_lenguaje: 'Norsk' });
  batch1.set(db.collection('idiomas').doc('fr'), { codigo_lenguaje: 'fr', nombre_lenguaje: 'Français' });
  batch1.set(db.collection('idiomas').doc('ca'), { codigo_lenguaje: 'ca', nombre_lenguaje: 'Català' });
  batch1.set(db.collection('idiomas').doc('da'), { codigo_lenguaje: 'da', nombre_lenguaje: 'Dansk' });

  // ─── EMERGENCIAS ──────────────────────────────────────────────────────────
  const emergencias = [
    { id: '1', titulo: 'Entorno NO Seguro', descripcion: 'NO es seguro. Alerta al 112 y espera a que la zona sea segura.', informacion_especifica: 'Tipo de peligro presente (fuego, tráfico, cables eléctricos, etc.)\nUbicación exacta del peligro\nSi hay personas en peligro y cuántas', version_id: 1 },
    { id: '2', titulo: 'Otra Emergencia', descripcion: 'Llama al 112 para orientación profesional.', informacion_especifica: 'Describe los síntomas o lesiones detectadas con detalle\nAntecedentes médicos relevantes (alergias, medicamentos, enfermedades)', version_id: 1 },
    { id: '3', titulo: 'Posible Hipoglucemia', descripcion: 'Si está consciente, dale azúcar. Llama al 112 si no mejora.', informacion_especifica: 'La persona es diabética\nPresenta sudor frío, temblores, confusión o debilidad\nSi está consciente y se le ha dado azúcar o zumo', version_id: 1 },
    { id: '4', titulo: 'Hemorragia Severa', descripcion: 'Aplica compresión directa inmediatamente y llama al 112.', informacion_especifica: 'Localización exacta de la hemorragia\nIntensidad del sangrado (abundante, a borbotones)\nSi has aplicado compresión directa sobre la herida\nSi la persona muestra signos de shock (palidez, sudor frío, temblores)', version_id: 1 },
    { id: '5', titulo: 'Posible Ictus / AVC', descripcion: 'El tiempo es crítico. Llama al 112 inmediatamente.', informacion_especifica: 'Debilidad o caída de un lado de la cara\nDesde cuándo comenzaron los síntomas (CRÍTICO)\nSi hay dificultad para hablar o entender\nSi hay debilidad en brazo o pierna', version_id: 1 },
    { id: '6', titulo: 'Posible Infarto', descripcion: 'Llama al 112 y mantén a la persona en reposo.', informacion_especifica: 'Dolor intenso en el pecho, opresión o fuerte presión\nDesde cuándo lleva el dolor\nSi el dolor irradia hacia brazo, cuello o mandíbula\nSi hay sudor frío, náuseas o dificultad respiratoria', version_id: 1 },
    { id: '7', titulo: 'Atragantamiento', descripcion: 'Aplica palmadas en la espalda y compresiones abdominales.', informacion_especifica: 'La persona está atragantada (incapaz de hablar)\nSi puede toser o hablar (atragantamiento parcial vs total)\nSi ya ha iniciado maniobras de Heimlich\nSi presenta coloración azulada (cianosis)', version_id: 1 },
    { id: '8', titulo: 'Ataque Epiléptico', descripcion: 'Protege a la persona de golpes. No la sujetes ni introduzcas nada en la boca.', informacion_especifica: 'Duración de las convulsiones\nSi es la primera vez o tiene historial de epilepsia\nSi ha perdido el conocimiento\nSi hay lesiones tras la convulsión', version_id: 1 },
    { id: '9', titulo: 'Parada Cardiorrespiratoria', descripcion: 'Llama al 112 e inicia RCP inmediatamente (30 compresiones / 2 ventilaciones).', informacion_especifica: 'La persona NO respira o respira de forma anormal\nEstá inconsciente, no responde a estímulos\nSi ya has iniciado o iniciarás RCP (30 compresiones / 2 ventilaciones)\nSi hay un DEA (desfibrilador) disponible cerca', version_id: 1 },
    { id: '10', titulo: 'Inconsciente pero Respirando', descripcion: 'Coloque en Posición Lateral de Seguridad (PLS) y vigile la respiración.', informacion_especifica: 'La persona está inconsciente pero respira\nYa la ha colocado en Posición Lateral de Seguridad (PLS)\nHace cuánto tiempo perdió la consciencia\nSi hay lesiones visibles (golpes en la cabeza, sangrado, etc.)', version_id: 1 },
  ];
  for (const e of emergencias) {
    const { id, ...data } = e;
    batch1.set(db.collection('emergencias').doc(id), data);
  }

  // ─── NODOS DE DECISIÓN ────────────────────────────────────────────────────
  const nodos = [
    { id: '1', pregunta: '¿Es el entorno seguro para mí y para la víctima?', id_version: 1, nodo_anterior: null },
    { id: '2', pregunta: '¿La víctima responde a estímulos al preguntarle "¿Está usted bien?" y sacudirla suavemente?', id_version: 1, nodo_anterior: 1 },
    { id: '3', pregunta: '¿Qué ha pasado? Seleccione lo que mejor describe la situación:', id_version: 1, nodo_anterior: 2 },
    { id: '4', pregunta: '¿Puede hablar o toser? (Si se lleva las manos al cuello y no puede, es atragantamiento total)', id_version: 1, nodo_anterior: 3 },
    { id: '5', pregunta: 'Tras abrir la vía aérea, ¿respira con normalidad?\n(Ver, oír, sentir durante 10 segundos)', id_version: 1, nodo_anterior: 2 },
  ];
  for (const n of nodos) {
    const { id, ...data } = n;
    batch1.set(db.collection('nodos_decision').doc(id), data);
  }

  await batch1.commit();
  console.log('✓ Emergencias y nodos subidos');

  // ─── OPCIONES DE NODOS ────────────────────────────────────────────────────
  const batch2 = db.batch();
  const opciones = [
    { id_nodo: 1, texto: 'Sí, el entorno es seguro', nodo_siguiente: 2, emergencia_resultante: null },
    { id_nodo: 1, texto: 'No, hay peligro (incendio, tráfico, cables, etc.)', nodo_siguiente: null, emergencia_resultante: 1 },
    { id_nodo: 2, texto: 'Sí, responde (consciente)', nodo_siguiente: 3, emergencia_resultante: null },
    { id_nodo: 2, texto: 'No responde (inconsciente)', nodo_siguiente: 5, emergencia_resultante: null },
    { id_nodo: 3, texto: 'Habla o tose con normalidad', nodo_siguiente: 4, emergencia_resultante: null },
    { id_nodo: 3, texto: 'Tiene dolor u opresión en el pecho', nodo_siguiente: null, emergencia_resultante: 6 },
    { id_nodo: 3, texto: 'Tiene debilidad en un lado del cuerpo o dificultad para hablar', nodo_siguiente: null, emergencia_resultante: 5 },
    { id_nodo: 3, texto: 'Presenta hemorragias externas', nodo_siguiente: null, emergencia_resultante: 4 },
    { id_nodo: 3, texto: 'Es diabético con sudor frío y temblores', nodo_siguiente: null, emergencia_resultante: 3 },
    { id_nodo: 3, texto: 'Otra emergencia', nodo_siguiente: null, emergencia_resultante: 2 },
    { id_nodo: 4, texto: 'Sí, puede hablar o toser', nodo_siguiente: null, emergencia_resultante: 2 },
    { id_nodo: 4, texto: 'No puede hablar ni toser - Se lleva las manos al cuello', nodo_siguiente: null, emergencia_resultante: 7 },
    { id_nodo: 5, texto: 'No respira o respiración anormal → PARADA CARDÍACA', nodo_siguiente: null, emergencia_resultante: 9 },
    { id_nodo: 5, texto: 'Sí, respira normalmente', nodo_siguiente: null, emergencia_resultante: 10 },
  ];
  opciones.forEach((op, i) => {
    batch2.set(db.collection('nodos_opciones').doc(String(i + 1)), op);
  });

  // ─── GUÍAS ────────────────────────────────────────────────────────────────
  const guias = [
    { id: '1', id_emergencia: 6, titulo: 'Infarto', descripcion: 'Guía de actuación ante un posible infarto de miocardio.', categoria_key: 'infarto', version_id: 1 },
    { id: '2', id_emergencia: 9, titulo: 'Parada Cardiorrespiratoria', descripcion: 'Guía de actuación ante una parada cardiorrespiratoria.', categoria_key: 'pcr', version_id: 1 },
    { id: '3', id_emergencia: 5, titulo: 'Ictus', descripcion: 'Guía de actuación ante un posible ictus o AVC.', categoria_key: 'ictus', version_id: 1 },
    { id: '4', id_emergencia: 8, titulo: 'Ataque Epiléptico', descripcion: 'Guía de actuación ante un ataque epiléptico.', categoria_key: 'epilepsia', version_id: 1 },
    { id: '5', id_emergencia: 7, titulo: 'Obstrucción de Vía Aérea', descripcion: 'Guía de actuación ante un atragantamiento.', categoria_key: 'atragantamiento', version_id: 1 },
    { id: '6', id_emergencia: 4, titulo: 'Hemorragia Severa', descripcion: 'Guía de actuación ante una hemorragia severa.', categoria_key: 'hemorragia', version_id: 1 },
  ];
  for (const g of guias) {
    const { id, ...data } = g;
    batch2.set(db.collection('guias').doc(id), data);
  }

  await batch2.commit();
  console.log('✓ Opciones de nodos y guías subidas');

  // ─── PASOS DE GUÍAS ───────────────────────────────────────────────────────
  const batch3 = db.batch();
  const pasos = [
    { id: '1',  id_guia: 1, titulo: 'Activar servicios de emergencia', contenido: 'Activar inmediatamente los servicios de emergencia (112)', orden: 1 },
    { id: '2',  id_guia: 1, titulo: 'Mantener en reposo', contenido: 'Mantener a la persona en reposo y tranquila', orden: 2 },
    { id: '3',  id_guia: 1, titulo: 'Vigilar consciencia', contenido: 'Vigilar el estado de conciencia y respiración', orden: 3 },
    { id: '4',  id_guia: 1, titulo: 'Preparar RCP', contenido: 'Prepararse para iniciar RCP si pierde el conocimiento', orden: 4 },
    { id: '5',  id_guia: 2, titulo: 'Llamar a emergencias', contenido: 'Llamar inmediatamente a emergencias (112)', orden: 1 },
    { id: '6',  id_guia: 2, titulo: 'Iniciar RCP', contenido: 'Iniciar maniobras de RCP (30 compresiones / 2 ventilaciones)', orden: 2 },
    { id: '7',  id_guia: 2, titulo: 'Usar DEA', contenido: 'Utilizar un DEA si está disponible', orden: 3 },
    { id: '8',  id_guia: 3, titulo: 'Llamar al 112', contenido: 'Contactar a emergencias de inmediato (112)', orden: 1 },
    { id: '9',  id_guia: 3, titulo: 'No esperar', contenido: 'No esperar: el tiempo es crítico para limitar el daño cerebral', orden: 2 },
    { id: '10', id_guia: 4, titulo: 'Proteger la cabeza', contenido: 'Proteger la cabeza y evitar objetos duros alrededor', orden: 1 },
    { id: '11', id_guia: 4, titulo: 'No intervenir', contenido: 'No introducir objetos en la boca ni sujetar al paciente', orden: 2 },
    { id: '12', id_guia: 4, titulo: 'Posición lateral', contenido: 'Tras la convulsión, colocar a la persona de lado', orden: 3 },
    { id: '13', id_guia: 5, titulo: 'Animar a toser', contenido: 'Si puede toser, animar a que lo haga', orden: 1 },
    { id: '14', id_guia: 5, titulo: 'Palmadas', contenido: 'Si no, aplicar 5 palmadas firmes en la espalda', orden: 2 },
    { id: '15', id_guia: 5, titulo: 'Heimlich', contenido: 'Aplicar compresiones abdominales (Maniobra de Heimlich)', orden: 3 },
    { id: '16', id_guia: 6, titulo: 'Llamar al 112', contenido: 'Llamar inmediatamente al 112', orden: 1 },
    { id: '17', id_guia: 6, titulo: 'Compresión directa', contenido: 'Aplicar compresión directa y continua sobre la herida con un paño limpio', orden: 2 },
    { id: '18', id_guia: 6, titulo: 'Añadir capas', contenido: 'Si la sangre empapa el paño, añadir más capas sin quitar las anteriores', orden: 3 },
    { id: '19', id_guia: 6, titulo: 'Elevar extremidad', contenido: 'Elevar la extremidad lesionada si es posible y no hay fractura', orden: 4 },
  ];
  for (const p of pasos) {
    const { id, ...data } = p;
    batch3.set(db.collection('pasos_guia').doc(id), data);
  }

  // ─── HERRAMIENTAS ─────────────────────────────────────────────────────────
  const herramientas = [
    { id: '1', nombre: 'Asistente llamada 112', descripcion: 'Geolocalización automática y guía estructurada para comunicarte con emergencias', version_id: 1 },
    { id: '2', nombre: 'Asistente de RCP', descripcion: 'Metrónomo 100 rpm, medidor de profundidad, temporizador de ciclos y contador', version_id: 1 },
    { id: '3', nombre: 'Medidor de frecuencia cardíaca', descripcion: 'Medición de la frecuencia cardíaca por fotopletismografía (cámara)', version_id: 1 },
    { id: '4', nombre: 'Test de detección de Ictus', descripcion: 'Método FAST para identificar rápidamente un posible accidente cerebrovascular', version_id: 1 },
    { id: '5', nombre: 'Calculadora de quemaduras', descripcion: 'Estima el porcentaje de superficie corporal quemada con la Regla de los 9', version_id: 1 },
    { id: '6', nombre: 'Registro de exploración secundaria', descripcion: 'Anota signos, síntomas y observaciones para entregar al personal sanitario', version_id: 1 },
    { id: '7', nombre: 'Ficha médica de emergencia', descripcion: 'Alergias, medicación y contactos de emergencia guardados en el dispositivo', version_id: 1 },
  ];
  for (const h of herramientas) {
    const { id, ...data } = h;
    batch3.set(db.collection('herramientas').doc(id), data);
  }

  // ─── RELACIÓN GUÍA ↔ HERRAMIENTA ─────────────────────────────────────────
  batch3.set(db.collection('guia_herramienta').doc('1'), {
    id_guia: 2, id_herramienta: 2, orden: 1, tipo_relacion: 'complementaria',
  });

  await batch3.commit();
  console.log('✓ Pasos de guías y herramientas subidos');

  // ─── TRADUCCIONES (clave-valor multi-idioma) ──────────────────────────────
  const batch4 = db.batch();
  const trad = (id, nombre, contexto, esText, enText, noText, frText, caText, daText) => {
    batch4.set(db.collection('traducciones').doc(String(id)), {
      id_texto: id,
      nombre_texto: nombre,
      contexto,
      version: '1.0.0',
      traducciones: { es: esText, en: enText, no: noText, fr: frText, ca: caText, da: daText },
    });
  };

  // emergencias (1-30)
  trad(1,  'emergencia.1.titulo',       'emergencia',
    'Entorno NO Seguro',
    'Unsafe Environment',
    'Utrygt Miljø',
    'Environnement NON Sécurisé',
    'Entorn NO Segur',
    'USIKKERT Miljø');
  trad(2,  'emergencia.1.descripcion',  'emergencia',
    'NO es seguro. Alerta al 112 y espera a que la zona sea segura.',
    'NOT safe. Alert 112 and wait until the area is safe.',
    'IKKE sikkert. Varsle 112 og vent til området er sikkert.',
    'PAS sécurisé. Alertez le 112 et attendez que la zone soit sécurisée.',
    'NO és segur. Avisa el 112 i espera que la zona sigui segura.',
    'IKKE sikkert. Alarmér 112 og vent, til området er sikkert.');
  trad(3,  'emergencia.1.informacion',  'emergencia',
    'Tipo de peligro presente (fuego, tráfico, cables eléctricos, etc.)\nUbicación exacta del peligro\nSi hay personas en peligro y cuántas',
    'Type of hazard present (fire, traffic, electrical cables, etc.)\nExact location of the hazard\nWhether there are people in danger and how many',
    'Type fare til stede (brann, trafikk, elektriske kabler, etc.)\nNøyaktig plassering av faren\nOm det er personer i fare og hvor mange',
    'Type de danger présent (feu, trafic, câbles électriques, etc.)\nLocalisation exacte du danger\nS\'il y a des personnes en danger et combien',
    'Tipus de perill present (foc, trànsit, cables elèctrics, etc.)\nUbicació exacta del perill\nSi hi ha persones en perill i quantes',
    'Type fare til stede (brand, trafik, el-kabler, osv.)\nNøjagtig placering af faren\nOm der er personer i fare og hvor mange');
  trad(4,  'emergencia.2.titulo',       'emergencia',
    'Otra Emergencia',
    'Other Emergency',
    'Annen Nødsituasjon',
    'Autre Urgence',
    'Altra Emergència',
    'Anden Nødsituation');
  trad(5,  'emergencia.2.descripcion',  'emergencia',
    'Llama al 112 para orientación profesional.',
    'Call 112 for professional guidance.',
    'Ring 112 for profesjonell veiledning.',
    'Appelez le 112 pour des conseils professionnels.',
    'Truca al 112 per a orientació professional.',
    'Ring 112 for professionel vejledning.');
  trad(6,  'emergencia.2.informacion',  'emergencia',
    'Describe los síntomas o lesiones detectadas con detalle\nAntecedentes médicos relevantes (alergias, medicamentos, enfermedades)',
    'Describe the detected symptoms or injuries in detail\nRelevant medical history (allergies, medications, conditions)',
    'Beskriv symptomene eller skadene som er oppdaget i detalj\nRelevant medisinsk historikk (allergier, medisiner, sykdommer)',
    'Décrivez en détail les symptômes ou blessures détectés\nAntécédents médicaux pertinents (allergies, médicaments, maladies)',
    'Descriu els símptomes o lesions detectades amb detall\nAntecedents mèdics rellevants (al·lèrgies, medicaments, malalties)',
    'Beskriv detaljeret de opdagede symptomer eller skader\nRelevant sygehistorie (allergier, medicin, sygdomme)');
  trad(7,  'emergencia.3.titulo',       'emergencia',
    'Posible Hipoglucemia',
    'Possible Hypoglycemia',
    'Mulig Hypoglykemi',
    'Possible Hypoglycémie',
    'Possible Hipoglucèmia',
    'Mulig Hypoglykæmi');
  trad(8,  'emergencia.3.descripcion',  'emergencia',
    'Si está consciente, dale azúcar. Llama al 112 si no mejora.',
    'If conscious, give sugar. Call 112 if no improvement.',
    'Hvis bevisst, gi sukker. Ring 112 hvis ingen bedring.',
    'Si conscient, donnez du sucre. Appelez le 112 si aucune amélioration.',
    'Si està conscient, dona-li sucre. Truca al 112 si no millora.',
    'Hvis bevidst, giv sukker. Ring 112, hvis ingen bedring.');
  trad(9,  'emergencia.3.informacion',  'emergencia',
    'La persona es diabética\nPresenta sudor frío, temblores, confusión o debilidad\nSi está consciente y se le ha dado azúcar o zumo',
    'The person is diabetic\nPresents cold sweat, tremors, confusion or weakness\nIf conscious and has been given sugar or juice',
    'Personen er diabetiker\nHar kaldsvette, skjelvinger, forvirring eller svakhet\nHvis bevisst og fått sukker eller juice',
    'La personne est diabétique\nPrésente sueurs froides, tremblements, confusion ou faiblesse\nSi consciente et on lui a donné du sucre ou du jus',
    'La persona és diabètica\nPresenta suor freda, tremolors, confusió o debilitat\nSi està conscient i se li ha donat sucre o suc',
    'Personen er diabetiker\nHar koldsved, rysteture, forvirring eller svaghed\nHvis bevidst og har fået sukker eller juice');
  trad(10, 'emergencia.4.titulo',       'emergencia',
    'Hemorragia Severa',
    'Severe Bleeding',
    'Alvorlig Blødning',
    'Hémorragie Sévère',
    'Hemorràgia Severa',
    'Svær Blødning');
  trad(11, 'emergencia.4.descripcion',  'emergencia',
    'Aplica compresión directa inmediatamente y llama al 112.',
    'Apply direct pressure immediately and call 112.',
    'Påfør direkte trykk umiddelbart og ring 112.',
    'Appliquez une pression directe immédiatement et appelez le 112.',
    'Aplica compressió directa immediatament i truca al 112.',
    'Påfør direkte tryk omgående og ring 112.');
  trad(12, 'emergencia.4.informacion',  'emergencia',
    'Localización exacta de la hemorragia\nIntensidad del sangrado (abundante, a borbotones)\nSi has aplicado compresión directa sobre la herida\nSi la persona muestra signos de shock (palidez, sudor frío, temblores)',
    'Exact location of the bleeding\nIntensity of bleeding (heavy, spurting)\nIf you have applied direct pressure on the wound\nIf the person shows signs of shock (paleness, cold sweat, tremors)',
    'Nøyaktig plassering av blødningen\nBlødningsintensitet (kraftig, pumping)\nOm du har påført direkte trykk på såret\nOm personen viser tegn på sjokk (blekhet, kaldsvette, skjelvinger)',
    'Localisation exacte de l\'hémorragie\nIntensité du saignement (abondant, en jets)\nSi vous avez appliqué une pression directe sur la blessure\nSi la personne montre des signes de choc (pâleur, sueurs froides, tremblements)',
    'Localització exacta de l\'hemorràgia\nIntensitat del sagnat (abundant, a rajolades)\nSi has aplicat compressió directa sobre la ferida\nSi la persona mostra signes de xoc (pal·lidesa, suor freda, tremolors)',
    'Nøjagtig placering af blødningen\nBlødningens intensitet (kraftig, pumper)\nOm du har påført direkte tryk på såret\nOm personen viser tegn på shock (bleghed, koldsved, rysteture)');
  trad(13, 'emergencia.5.titulo',       'emergencia',
    'Posible Ictus / AVC',
    'Possible Stroke / CVA',
    'Mulig Slag / Hjerneslag',
    'Possible AVC / Accident Vasculaire Cérébral',
    'Possible Ictus / AVC',
    'Muligt Slagtilfælde / Apopleksi');
  trad(14, 'emergencia.5.descripcion',  'emergencia',
    'El tiempo es crítico. Llama al 112 inmediatamente.',
    'Time is critical. Call 112 immediately.',
    'Tid er avgjørende. Ring 112 umiddelbart.',
    'Le temps est critique. Appelez le 112 immédiatement.',
    'El temps és crític. Truca al 112 immediatament.',
    'Tid er afgørende. Ring 112 straks.');
  trad(15, 'emergencia.5.informacion',  'emergencia',
    'Debilidad o caída de un lado de la cara\nDesde cuándo comenzaron los síntomas (CRÍTICO)\nSi hay dificultad para hablar o entender\nSi hay debilidad en brazo o pierna',
    'Weakness or drooping on one side of the face\nWhen symptoms started (CRITICAL)\nIf there is difficulty speaking or understanding\nIf there is weakness in arm or leg',
    'Svakhet eller henging på den ene siden av ansiktet\nNår symptomene begynte (KRITISK)\nOm det er vanskeligheter med å snakke eller forstå\nOm det er svakhet i arm eller bein',
    'Faiblesse ou affaissement d\'un côté du visage\nDepuis quand les symptômes ont commencé (CRITIQUE)\nS\'il y a des difficultés à parler ou à comprendre\nS\'il y a une faiblesse dans le bras ou la jambe',
    'Debilitat o caiguda d\'un costat de la cara\nDes de quan van começar els símptomes (CRÍTIC)\nSi hi ha dificultat per parlar o entendre\nSi hi ha debilitat al braç o a la cama',
    'Svaghed eller hængende på den ene side af ansigtet\nHvornår symptomerne startede (KRITISK)\nOm der er vanskeligheder med at tale eller forstå\nOm der er svaghed i arm eller ben');
  trad(16, 'emergencia.6.titulo',       'emergencia',
    'Posible Infarto',
    'Possible Heart Attack',
    'Mulig Hjerteinfarkt',
    'Possible Crise Cardiaque',
    'Possible Infart',
    'Muligt Hjerteanfald');
  trad(17, 'emergencia.6.descripcion',  'emergencia',
    'Llama al 112 y mantén a la persona en reposo.',
    'Call 112 and keep the person at rest.',
    'Ring 112 og hold personen i ro.',
    'Appelez le 112 et gardez la personne au repos.',
    'Truca al 112 i mantén la persona en repòs.',
    'Ring 112 og hold personen i ro.');
  trad(18, 'emergencia.6.informacion',  'emergencia',
    'Dolor intenso en el pecho, opresión o fuerte presión\nDesde cuándo lleva el dolor\nSi el dolor irradia hacia brazo, cuello o mandíbula\nSi hay sudor frío, náuseas o dificultad respiratoria',
    'Intense chest pain, tightness or strong pressure\nHow long the pain has lasted\nIf the pain radiates to the arm, neck or jaw\nIf there is cold sweat, nausea or breathing difficulty',
    'Intense brystsmerter, trykk eller sterk press\nHvor lenge smertene har vart\nOm smertene stråler til arm, nakke eller kjeve\nOm det er kaldsvette, kvalme eller pustevansker',
    'Douleur intense dans la poitrine, oppression ou forte pression\nDepuis combien de temps la douleur dure\nSi la douleur irradie vers le bras, le cou ou la mâchoire\nS\'il y a des sueurs froides, nausées ou difficultés respiratoires',
    'Dolor intens al pit, opressió o forta pressió\nDes de quan dura el dolor\nSi el dolor irradia cap al braç, coll o mandíbula\nSi hi ha suor freda, nàusees o dificultat respiratòria',
    'Intense brystsmerter, trykken eller stærkt pres\nHvor længe smerten har varet\nOm smerten stråler ud i arm, nakke eller kæbe\nOm der er koldsved, kvalme eller åndedrætsbesvær');
  trad(19, 'emergencia.7.titulo',       'emergencia',
    'Atragantamiento',
    'Choking',
    'Kvelning',
    'Étouffement',
    'Ofegament',
    'Kvælning');
  trad(20, 'emergencia.7.descripcion',  'emergencia',
    'Aplica palmadas en la espalda y compresiones abdominales.',
    'Apply back blows and abdominal compressions.',
    'Gi ryggslag og magetrykk.',
    'Appliquez des claques dans le dos et des compressions abdominales.',
    'Aplica cops a l\'esquena i compressions abdominals.',
    'Giv rygslag og mavekompressioner.');
  trad(21, 'emergencia.7.informacion',  'emergencia',
    'La persona está atragantada (incapaz de hablar)\nSi puede toser o hablar (atragantamiento parcial vs total)\nSi ya ha iniciado maniobras de Heimlich\nSi presenta coloración azulada (cianosis)',
    'The person is choking (unable to speak)\nIf they can cough or speak (partial vs total obstruction)\nIf Heimlich maneuver has already been initiated\nIf there is bluish coloration (cyanosis)',
    'Personen er kvelnet (ute av stand til å snakke)\nOm han/hun kan hoste eller snakke (delvis vs total tilstopping)\nOm Heimlich-manøveren allerede er igangsatt\nOm det er blåfarge (cyanose)',
    'La personne s\'étouffe (incapable de parler)\nSi elle peut tousser ou parler (obstruction partielle vs totale)\nSi la manœuvre de Heimlich a déjà été initiée\nSi elle présente une coloration bleutée (cyanose)',
    'La persona s\'ofega (incapaç de parlar)\nSi pot tossir o parlar (ofegament parcial vs total)\nSi ja s\'han iniciat maniobres de Heimlich\nSi presenta coloració blavosa (cianosi)',
    'Personen kvæler sig (ude af stand til at tale)\nOm vedkommende kan hoste eller tale (delvis vs total tilstopning)\nOm Heimlich-manøvren allerede er iværksat\nOm der er blålig misfarvning (cyanose)');
  trad(22, 'emergencia.8.titulo',       'emergencia',
    'Ataque Epiléptico',
    'Epileptic Seizure',
    'Epileptisk Anfall',
    'Crise Épileptique',
    'Atac Epilèptic',
    'Epileptisk Anfald');
  trad(23, 'emergencia.8.descripcion',  'emergencia',
    'Protege a la persona de golpes. No la sujetes ni introduzcas nada en la boca.',
    'Protect the person from impacts. Do not restrain them or put anything in their mouth.',
    'Beskytt personen mot slag. Ikke hold ham/henne fast eller stikk noe i munnen.',
    'Protégez la personne des chocs. Ne la retenez pas et n\'introduisez rien dans la bouche.',
    'Protegeix la persona de cops. No la subjectis ni introdueixis res a la boca.',
    'Beskyt personen mod slag. Hold dem ikke fast og sæt ingenting i munden.');
  trad(24, 'emergencia.8.informacion',  'emergencia',
    'Duración de las convulsiones\nSi es la primera vez o tiene historial de epilepsia\nSi ha perdido el conocimiento\nSi hay lesiones tras la convulsión',
    'Duration of the seizures\nIf it is the first time or has a history of epilepsy\nIf they have lost consciousness\nIf there are injuries after the seizure',
    'Varighet av anfallet\nOm det er første gang eller har epilepsihistorikk\nOm bevisstheten er tapt\nOm det er skader etter anfallet',
    'Durée des convulsions\nSi c\'est la première fois ou s\'il a des antécédents d\'épilepsie\nS\'il a perdu connaissance\nS\'il y a des blessures après la convulsion',
    'Durada de les convulsions\nSi és la primera vegada o té historial d\'epilèpsia\nSi ha perdut el coneixement\nSi hi ha lesions després de la convulsió',
    'Anfaldets varighed\nOm det er første gang eller har epilepsihistorik\nOm bevidstheden er tabt\nOm der er skader efter anfallet');
  trad(25, 'emergencia.9.titulo',       'emergencia',
    'Parada Cardiorrespiratoria',
    'Cardiac Arrest',
    'Hjertestans',
    'Arrêt Cardio-Respiratoire',
    'Aturada Cardiorespiratòria',
    'Hjertestop');
  trad(26, 'emergencia.9.descripcion',  'emergencia',
    'Llama al 112 e inicia RCP inmediatamente (30 compresiones / 2 ventilaciones).',
    'Call 112 and start CPR immediately (30 compressions / 2 ventilations).',
    'Ring 112 og start HLR umiddelbart (30 kompresjoner / 2 innblåsninger).',
    'Appelez le 112 et commencez la RCP immédiatement (30 compressions / 2 ventilations).',
    'Truca al 112 i inicia RCP immediatament (30 compressions / 2 ventilacions).',
    'Ring 112 og påbegynd HLR straks (30 kompressioner / 2 indblæsninger).');
  trad(27, 'emergencia.9.informacion',  'emergencia',
    'La persona NO respira o respira de forma anormal\nEstá inconsciente, no responde a estímulos\nSi ya has iniciado o iniciarás RCP (30 compresiones / 2 ventilaciones)\nSi hay un DEA (desfibrilador) disponible cerca',
    'The person is NOT breathing or breathing abnormally\nUnconscious, does not respond to stimuli\nIf you have started or will start CPR (30 compressions / 2 ventilations)\nIf there is an AED (defibrillator) available nearby',
    'Personen puster IKKE eller puster unormalt\nEr bevisstløs, reagerer ikke på stimuli\nOm du har startet eller vil starte HLR (30 kompresjoner / 2 innblåsninger)\nOm det er en AED (hjertestarter) tilgjengelig i nærheten',
    'La personne ne respire PAS ou respire de façon anormale\nEst inconsciente, ne répond pas aux stimuli\nSi vous avez commencé ou commencerez la RCP (30 compressions / 2 ventilations)\nS\'il y a un DAE (défibrillateur) disponible à proximité',
    'La persona NO respira o respira de forma anormal\nEstà inconscient, no respon a estímuls\nSi ja has iniciat o iniciàs RCP (30 compressions / 2 ventilacions)\nSi hi ha un DEA (desfibril·lador) disponible a prop',
    'Personen puster IKKE eller puster unormalt\nEr bevidstløs, reagerer ikke på stimuli\nOm du har påbegyndt eller vil påbegynde HLR (30 kompressioner / 2 indblæsninger)\nOm der er en AED (hjertestarter) tilgængeligt i nærheden');
  trad(28, 'emergencia.10.titulo',      'emergencia',
    'Inconsciente pero Respirando',
    'Unconscious but Breathing',
    'Bevisstløs men Puster',
    'Inconscient mais Respire',
    'Inconscient però Respirant',
    'Bevidstløs men Vejrtrækker');
  trad(29, 'emergencia.10.descripcion', 'emergencia',
    'Coloque en Posición Lateral de Seguridad (PLS) y vigile la respiración.',
    'Place in Recovery Position and monitor breathing.',
    'Legg i stabilt sideleie og overvåk pusten.',
    'Placez en Position Latérale de Sécurité (PLS) et surveillez la respiration.',
    'Col·loqueu en Posició Lateral de Seguretat (PLS) i vigileu la respiració.',
    'Placer i Stabilt Sideleje og overvåg vejrtrækningen.');
  trad(30, 'emergencia.10.informacion', 'emergencia',
    'La persona está inconsciente pero respira\nYa la ha colocado en Posición Lateral de Seguridad (PLS)\nHace cuánto tiempo perdió la consciencia\nSi hay lesiones visibles (golpes en la cabeza, sangrado, etc.)',
    'The person is unconscious but breathing\nHas already been placed in Recovery Position\nHow long ago they lost consciousness\nIf there are visible injuries (head blows, bleeding, etc.)',
    'Personen er bevisstløs men puster\nEr allerede lagt i stabilt sideleie\nHvor lenge siden bevisstheten ble tapt\nOm det er synlige skader (hodeskader, blødning, etc.)',
    'La personne est inconsciente mais respire\nA déjà été placée en Position Latérale de Sécurité (PLS)\nDepuis combien de temps elle a perdu connaissance\nS\'il y a des blessures visibles (coups à la tête, saignement, etc.)',
    'La persona és inconscient però respira\nJa s\'ha col·locat en Posició Lateral de Seguretat (PLS)\nFa quant temps va perdre la consciència\nSi hi ha lesions visibles (cops al cap, sagnat, etc.)',
    'Personen er bevidstløs men vejrtrækker\nEr allerede lagt i stabilt sideleje\nHvor længe siden vedkommende mistede bevidstheden\nOm der er synlige skader (slag til hovedet, blødning, osv.)');

  // nodos (31-35)
  trad(31, 'nodo.1.pregunta', 'nodo',
    '¿Es el entorno seguro para mí y para la víctima?',
    'Is the environment safe for me and the victim?',
    'Er omgivelsene trygge for meg og offeret?',
    'L\'environnement est-il sécurisé pour moi et pour la victime ?',
    'L\'entorn és segur per a mi i per a la víctima?',
    'Er omgivelserne sikre for mig og offeret?');
  trad(32, 'nodo.2.pregunta', 'nodo',
    '¿La víctima responde a estímulos al preguntarle "¿Está usted bien?" y sacudirla suavemente?',
    'Does the victim respond to stimuli when asked "Are you okay?" and gently shaken?',
    'Reagerer offeret på stimuli når du spør "Har du det bra?" og rister det forsiktig?',
    'La victime répond-elle aux stimuli quand on lui demande "Ça va ?" et qu\'on la secoue doucement ?',
    'La víctima respon a estímuls en preguntar-li "Esteu bé?" i sacsejar-la suaument?',
    'Reagerer offeret på stimuli, når du spørger "Har du det godt?" og ryster vedkommende forsigtigt?');
  trad(33, 'nodo.3.pregunta', 'nodo',
    '¿Qué ha pasado? Seleccione lo que mejor describe la situación:',
    'What happened? Select what best describes the situation:',
    'Hva har skjedd? Velg det som best beskriver situasjonen:',
    'Que s\'est-il passé ? Sélectionnez ce qui décrit le mieux la situation :',
    'Què ha passat? Seleccioneu el que millor descriu la situació:',
    'Hvad er der sket? Vælg det, der bedst beskriver situationen:');
  trad(34, 'nodo.4.pregunta', 'nodo',
    '¿Puede hablar o toser? (Si se lleva las manos al cuello y no puede, es atragantamiento total)',
    'Can they speak or cough? (If hands go to throat and they cannot, it is complete choking)',
    'Kan de snakke eller hoste? (Hvis de holder seg for halsen og ikke kan, er det total kvelning)',
    'Peut-il parler ou tousser ? (S\'il se tient le cou et ne peut pas, c\'est un étouffement total)',
    'Pot parlar o tossir? (Si es porta les mans al coll i no pot, és ofegament total)',
    'Kan vedkommende tale eller hoste? (Hvis de holder sig til halsen og ikke kan, er det total kvælning)');
  trad(35, 'nodo.5.pregunta', 'nodo',
    'Tras abrir la vía aérea, ¿respira con normalidad?\n(Ver, oír, sentir durante 10 segundos)',
    'After opening the airway, are they breathing normally?\n(Look, listen, feel for 10 seconds)',
    'Etter å ha åpnet luftveien, puster vedkommende normalt?\n(Se, høre, kjenne i 10 sekunder)',
    'Après avoir ouvert les voies respiratoires, respire-t-il normalement ?\n(Voir, entendre, sentir pendant 10 secondes)',
    'Després d\'obrir la via aèria, respira amb normalitat?\n(Veure, sentir, notar durant 10 segons)',
    'Efter åbning af luftvejen, vejrtrækker vedkommende normalt?\n(Se, høre, mærke i 10 sekunder)');

  // opciones (36-49)
  trad(36, 'opcion.1.texto',  'opcion',
    'Sí, el entorno es seguro',
    'Yes, the environment is safe',
    'Ja, omgivelsene er trygge',
    'Oui, l\'environnement est sécurisé',
    'Sí, l\'entorn és segur',
    'Ja, omgivelserne er sikre');
  trad(37, 'opcion.2.texto',  'opcion',
    'No, hay peligro (incendio, tráfico, cables, etc.)',
    'No, there is danger (fire, traffic, cables, etc.)',
    'Nei, det er fare (brann, trafikk, kabler, etc.)',
    'Non, il y a un danger (incendie, trafic, câbles, etc.)',
    'No, hi ha perill (incendi, trànsit, cables, etc.)',
    'Nej, der er fare (brand, trafik, kabler, osv.)');
  trad(38, 'opcion.3.texto',  'opcion',
    'Sí, responde (consciente)',
    'Yes, responds (conscious)',
    'Ja, reagerer (bevisst)',
    'Oui, répond (conscient)',
    'Sí, respon (conscient)',
    'Ja, reagerer (bevidst)');
  trad(39, 'opcion.4.texto',  'opcion',
    'No responde (inconsciente)',
    'Does not respond (unconscious)',
    'Reagerer ikke (bevisstløs)',
    'Ne répond pas (inconscient)',
    'No respon (inconscient)',
    'Reagerer ikke (bevidstløs)');
  trad(40, 'opcion.5.texto',  'opcion',
    'Habla o tose con normalidad',
    'Speaks or coughs normally',
    'Snakker eller hoster normalt',
    'Parle ou tousse normalement',
    'Parla o tosseix amb normalitat',
    'Taler eller hoster normalt');
  trad(41, 'opcion.6.texto',  'opcion',
    'Tiene dolor u opresión en el pecho',
    'Has chest pain or tightness',
    'Har brystsmerter eller trykk i brystet',
    'A des douleurs ou une oppression thoracique',
    'Té dolor o opressió al pit',
    'Har brystsmerter eller trykken i brystet');
  trad(42, 'opcion.7.texto',  'opcion',
    'Tiene debilidad en un lado del cuerpo o dificultad para hablar',
    'Has weakness on one side of body or difficulty speaking',
    'Har svakhet på den ene siden av kroppen eller vansker med å snakke',
    'A une faiblesse d\'un côté du corps ou des difficultés à parler',
    'Té debilitat en un costat del cos o dificultat per parlar',
    'Har svaghed på den ene side af kroppen eller talebesvær');
  trad(43, 'opcion.8.texto',  'opcion',
    'Presenta hemorragias externas',
    'Has external bleeding',
    'Har ekstern blødning',
    'Présente des hémorragies externes',
    'Presenta hemorràgies externes',
    'Har ekstern blødning');
  trad(44, 'opcion.9.texto',  'opcion',
    'Es diabético con sudor frío y temblores',
    'Diabetic with cold sweat and tremors',
    'Er diabetiker med kaldsvette og skjelvinger',
    'Est diabétique avec sueurs froides et tremblements',
    'És diabètic amb suor freda i tremolors',
    'Er diabetiker med koldsved og rysteture');
  trad(45, 'opcion.10.texto', 'opcion',
    'Otra emergencia',
    'Other emergency',
    'Annen nødsituasjon',
    'Autre urgence',
    'Altra emergència',
    'Anden nødsituation');
  trad(46, 'opcion.11.texto', 'opcion',
    'Sí, puede hablar o toser',
    'Yes, can speak or cough',
    'Ja, kan snakke eller hoste',
    'Oui, peut parler ou tousser',
    'Sí, pot parlar o tossir',
    'Ja, kan tale eller hoste');
  trad(47, 'opcion.12.texto', 'opcion',
    'No puede hablar ni toser - Se lleva las manos al cuello',
    'Cannot speak or cough – Hands go to throat',
    'Kan ikke snakke eller hoste – holder seg for halsen',
    'Ne peut ni parler ni tousser – Se tient le cou',
    'No pot parlar ni tossir - Es porta les mans al coll',
    'Kan ikke tale eller hoste – holder sig til halsen');
  trad(48, 'opcion.13.texto', 'opcion',
    'No respira o respiración anormal → PARADA CARDÍACA',
    'Not breathing or abnormal breathing → CARDIAC ARREST',
    'Puster ikke eller unormal pust → HJERTESTANS',
    'Ne respire pas ou respiration anormale → ARRÊT CARDIAQUE',
    'No respira o respiració anormal → ATURADA CARDÍACA',
    'Vejrtrækker ikke eller unormal vejrtrækning → HJERTESTOP');
  trad(49, 'opcion.14.texto', 'opcion',
    'Sí, respira normalmente',
    'Yes, breathing normally',
    'Ja, puster normalt',
    'Oui, respire normalement',
    'Sí, respira normalment',
    'Ja, vejrtrækker normalt');

  // guias (50-61)
  trad(50, 'guia.1.titulo',      'guia',
    'Infarto',
    'Heart Attack',
    'Hjerteinfarkt',
    'Crise Cardiaque',
    'Infart',
    'Hjerteanfald');
  trad(51, 'guia.1.descripcion', 'guia',
    'Guía de actuación ante un posible infarto de miocardio.',
    'Action guide for a possible myocardial infarction.',
    'Handlingsguide ved mulig hjerteinfarkt.',
    'Guide d\'action pour un possible infarctus du myocarde.',
    'Guia d\'actuació davant d\'un possible infart de miocardi.',
    'Handlingsguide ved muligt hjerteinfarkt.');
  trad(52, 'guia.2.titulo',      'guia',
    'Parada Cardiorrespiratoria',
    'Cardiac Arrest',
    'Hjertestans',
    'Arrêt Cardio-Respiratoire',
    'Aturada Cardiorespiratòria',
    'Hjertestop');
  trad(53, 'guia.2.descripcion', 'guia',
    'Guía de actuación ante una parada cardiorrespiratoria.',
    'Action guide for a cardiac arrest.',
    'Handlingsguide ved hjertestans.',
    'Guide d\'action pour un arrêt cardio-respiratoire.',
    'Guia d\'actuació davant d\'una aturada cardiorespiratòria.',
    'Handlingsguide ved hjertestop.');
  trad(54, 'guia.3.titulo',      'guia',
    'Ictus',
    'Stroke',
    'Hjerneslag',
    'AVC',
    'Ictus',
    'Slagtilfælde');
  trad(55, 'guia.3.descripcion', 'guia',
    'Guía de actuación ante un posible ictus o AVC.',
    'Action guide for a possible stroke or CVA.',
    'Handlingsguide ved mulig hjerneslag.',
    'Guide d\'action pour un possible AVC.',
    'Guia d\'actuació davant d\'un possible ictus o AVC.',
    'Handlingsguide ved muligt slagtilfælde.');
  trad(56, 'guia.4.titulo',      'guia',
    'Ataque Epiléptico',
    'Epileptic Seizure',
    'Epileptisk Anfall',
    'Crise Épileptique',
    'Atac Epilèptic',
    'Epileptisk Anfald');
  trad(57, 'guia.4.descripcion', 'guia',
    'Guía de actuación ante un ataque epiléptico.',
    'Action guide for an epileptic seizure.',
    'Handlingsguide ved epileptisk anfall.',
    'Guide d\'action pour une crise épileptique.',
    'Guia d\'actuació davant d\'un atac epilèptic.',
    'Handlingsguide ved epileptisk anfald.');
  trad(58, 'guia.5.titulo',      'guia',
    'Obstrucción de Vía Aérea',
    'Airway Obstruction',
    'Luftveisobstruksjon',
    'Obstruction des Voies Aériennes',
    'Obstrucció de Vies Aèries',
    'Luftvejsobstruktion');
  trad(59, 'guia.5.descripcion', 'guia',
    'Guía de actuación ante un atragantamiento.',
    'Action guide for choking.',
    'Handlingsguide ved kvelning.',
    'Guide d\'action pour un étouffement.',
    'Guia d\'actuació davant d\'un ofegament.',
    'Handlingsguide ved kvælning.');
  trad(60, 'guia.6.titulo',      'guia',
    'Hemorragia Severa',
    'Severe Bleeding',
    'Alvorlig Blødning',
    'Hémorragie Sévère',
    'Hemorràgia Severa',
    'Svær Blødning');
  trad(61, 'guia.6.descripcion', 'guia',
    'Guía de actuación ante una hemorragia severa.',
    'Action guide for severe bleeding.',
    'Handlingsguide ved alvorlig blødning.',
    'Guide d\'action pour une hémorragie sévère.',
    'Guia d\'actuació davant d\'una hemorràgia severa.',
    'Handlingsguide ved svær blødning.');

  // pasos (62-99)
  trad(62,  'paso.1.titulo',     'paso',
    'Activar servicios de emergencia', 'Activate emergency services',
    'Aktiver nødetjenester', 'Activer les services d\'urgence', 'Activar serveis d\'emergència', 'Aktivér nødtjenester');
  trad(63,  'paso.1.contenido',  'paso',
    'Activar inmediatamente los servicios de emergencia (112)', 'Immediately activate emergency services (112)',
    'Aktiver umiddelbart nødetjenestene (112)', 'Activer immédiatement les services d\'urgence (112)', 'Activar immediatament els serveis d\'emergència (112)', 'Aktivér straks nødtjenesterne (112)');
  trad(64,  'paso.2.titulo',     'paso',
    'Mantener en reposo', 'Keep at rest',
    'Hold i ro', 'Garder au repos', 'Mantenir en repòs', 'Hold i ro');
  trad(65,  'paso.2.contenido',  'paso',
    'Mantener a la persona en reposo y tranquila', 'Keep the person at rest and calm',
    'Hold personen i ro og avslappet', 'Garder la personne au repos et calme', 'Mantenir la persona en repòs i tranquil·la', 'Hold personen i ro og afslappet');
  trad(66,  'paso.3.titulo',     'paso',
    'Vigilar consciencia', 'Monitor consciousness',
    'Overvåk bevissthet', 'Surveiller la conscience', 'Vigilar la consciència', 'Overvåg bevidsthed');
  trad(67,  'paso.3.contenido',  'paso',
    'Vigilar el estado de conciencia y respiración', 'Monitor the state of consciousness and breathing',
    'Overvåk bevissthetsnivå og pust', 'Surveiller l\'état de conscience et la respiration', 'Vigilar l\'estat de consciència i la respiració', 'Overvåg bevidsthedsniveau og vejrtrækning');
  trad(68,  'paso.4.titulo',     'paso',
    'Preparar RCP', 'Prepare CPR',
    'Forbered HLR', 'Préparer la RCP', 'Preparar RCP', 'Forbered HLR');
  trad(69,  'paso.4.contenido',  'paso',
    'Prepararse para iniciar RCP si pierde el conocimiento', 'Be ready to start CPR if they lose consciousness',
    'Vær klar til å starte HLR hvis bevisstheten tapes', 'Se préparer à commencer la RCP en cas de perte de connaissance', 'Preparar-se per iniciar RCP si perd el coneixement', 'Vær parat til at påbegynde HLR, hvis bevidstheden mistes');
  trad(70,  'paso.5.titulo',     'paso',
    'Llamar a emergencias', 'Call emergency services',
    'Ring nødnummeret', 'Appeler les secours', 'Trucar a emergències', 'Ring til nødtjenester');
  trad(71,  'paso.5.contenido',  'paso',
    'Llamar inmediatamente a emergencias (112)', 'Immediately call emergency services (112)',
    'Ring umiddelbart til nødnummeret (112)', 'Appeler immédiatement les secours (112)', 'Trucar immediatament a emergències (112)', 'Ring straks til nødtjenesterne (112)');
  trad(72,  'paso.6.titulo',     'paso',
    'Iniciar RCP', 'Start CPR',
    'Start HLR', 'Commencer la RCP', 'Iniciar RCP', 'Påbegynd HLR');
  trad(73,  'paso.6.contenido',  'paso',
    'Iniciar maniobras de RCP (30 compresiones / 2 ventilaciones)', 'Start CPR (30 compressions / 2 ventilations)',
    'Start HLR (30 kompresjoner / 2 innblåsninger)', 'Commencer les manœuvres de RCP (30 compressions / 2 ventilations)', 'Iniciar maniobres de RCP (30 compressions / 2 ventilacions)', 'Påbegynd HLR (30 kompressioner / 2 indblæsninger)');
  trad(74,  'paso.7.titulo',     'paso',
    'Usar DEA', 'Use AED',
    'Bruk AED', 'Utiliser le DAE', 'Usar DEA', 'Brug AED');
  trad(75,  'paso.7.contenido',  'paso',
    'Utilizar un DEA si está disponible', 'Use an AED if available',
    'Bruk en AED (hjertestarter) hvis tilgjengelig', 'Utiliser un DAE si disponible', 'Utilitzar un DEA si està disponible', 'Brug en AED (hjertestarter), hvis tilgængelig');
  trad(76,  'paso.8.titulo',     'paso',
    'Llamar al 112', 'Call 112',
    'Ring 112', 'Appeler le 112', 'Trucar al 112', 'Ring 112');
  trad(77,  'paso.8.contenido',  'paso',
    'Contactar a emergencias de inmediato (112)', 'Contact emergency services immediately (112)',
    'Kontakt nødetjenesten umiddelbart (112)', 'Contacter les secours immédiatement (112)', 'Contactar emergències de seguida (112)', 'Kontakt nødtjenesten straks (112)');
  trad(78,  'paso.9.titulo',     'paso',
    'No esperar', 'Do not wait',
    'Ikke vent', 'Ne pas attendre', 'No esperar', 'Vent ikke');
  trad(79,  'paso.9.contenido',  'paso',
    'No esperar: el tiempo es crítico para limitar el daño cerebral', 'Do not wait: time is critical to limit brain damage',
    'Ikke vent: tid er avgjørende for å begrense hjerneskaden', 'Ne pas attendre : le temps est critique pour limiter les dommages cérébraux', 'No esperar: el temps és crític per limitar el dany cerebral', 'Vent ikke: tid er afgørende for at begrænse hjerneskaden');
  trad(80,  'paso.10.titulo',    'paso',
    'Proteger la cabeza', 'Protect the head',
    'Beskytt hodet', 'Protéger la tête', 'Protegir el cap', 'Beskyt hovedet');
  trad(81,  'paso.10.contenido', 'paso',
    'Proteger la cabeza y evitar objetos duros alrededor', 'Protect the head and remove hard objects from the area',
    'Beskytt hodet og fjern harde gjenstander i nærheten', 'Protéger la tête et éviter les objets durs autour', 'Protegir el cap i evitar objectes durs al voltant', 'Beskyt hovedet og fjern hårde genstande i nærheden');
  trad(82,  'paso.11.titulo',    'paso',
    'No intervenir', 'Do not intervene',
    'Ikke gripe inn', 'Ne pas intervenir', 'No intervenir', 'Grib ikke ind');
  trad(83,  'paso.11.contenido', 'paso',
    'No introducir objetos en la boca ni sujetar al paciente', 'Do not put objects in the mouth or restrain the patient',
    'Ikke stikk gjenstander i munnen og ikke hold pasienten fast', 'Ne pas mettre d\'objets dans la bouche ni retenir le patient', 'No introduir objectes a la boca ni subjectar el pacient', 'Sæt ikke genstande i munden og hold ikke patienten fast');
  trad(84,  'paso.12.titulo',    'paso',
    'Posición lateral', 'Recovery position',
    'Sideleie', 'Position latérale', 'Posició lateral', 'Sideleje');
  trad(85,  'paso.12.contenido', 'paso',
    'Tras la convulsión, colocar a la persona de lado', 'After the seizure, place the person on their side',
    'Etter anfallet, legg personen på siden', 'Après la convulsion, placer la personne sur le côté', 'Després de la convulsió, col·locar la persona de costat', 'Efter anfallet, læg personen på siden');
  trad(86,  'paso.13.titulo',    'paso',
    'Animar a toser', 'Encourage coughing',
    'Oppmuntre til hosting', 'Encourager la toux', 'Animar a tossir', 'Opfordr til at hoste');
  trad(87,  'paso.13.contenido', 'paso',
    'Si puede toser, animar a que lo haga', 'If they can cough, encourage them to do so',
    'Hvis vedkommende kan hoste, oppmuntre dem til å gjøre det', 'S\'il peut tousser, l\'encourager à le faire', 'Si pot tossir, animar-lo que ho faci', 'Hvis vedkommende kan hoste, opfordr dem til at gøre det');
  trad(88,  'paso.14.titulo',    'paso',
    'Palmadas', 'Back blows',
    'Ryggslag', 'Claques dans le dos', 'Cops a l\'esquena', 'Rygslag');
  trad(89,  'paso.14.contenido', 'paso',
    'Si no, aplicar 5 palmadas firmes en la espalda', 'If not, apply 5 firm back blows between shoulder blades',
    'Ellers, gi 5 kraftige slag på ryggen mellom skulderbladene', 'Sinon, appliquer 5 claques fermes dans le dos', 'Si no, aplicar 5 cops ferms a l\'esquena', 'Ellers, giv 5 kraftige slag på ryggen mellem skulderbladene');
  trad(90,  'paso.15.titulo',    'paso',
    'Heimlich', 'Heimlich',
    'Heimlich', 'Heimlich', 'Heimlich', 'Heimlich');
  trad(91,  'paso.15.contenido', 'paso',
    'Aplicar compresiones abdominales (Maniobra de Heimlich)', 'Apply abdominal thrusts (Heimlich maneuver)',
    'Utfør abdominale kompresjoner (Heimlich-manøveren)', 'Appliquer des compressions abdominales (Manœuvre de Heimlich)', 'Aplicar compressions abdominals (Maniobra de Heimlich)', 'Udfør mavekompressioner (Heimlich-manøvren)');
  trad(92,  'paso.16.titulo',    'paso',
    'Llamar al 112', 'Call 112',
    'Ring 112', 'Appeler le 112', 'Trucar al 112', 'Ring 112');
  trad(93,  'paso.16.contenido', 'paso',
    'Llamar inmediatamente al 112', 'Call 112 immediately',
    'Ring umiddelbart til 112', 'Appeler immédiatement le 112', 'Trucar immediatament al 112', 'Ring straks til 112');
  trad(94,  'paso.17.titulo',    'paso',
    'Compresión directa', 'Direct pressure',
    'Direkte trykk', 'Pression directe', 'Compressió directa', 'Direkte tryk');
  trad(95,  'paso.17.contenido', 'paso',
    'Aplicar compresión directa y continua sobre la herida con un paño limpio', 'Apply direct and continuous pressure on the wound with a clean cloth',
    'Påfør direkte og vedvarende trykk på såret med et rent klede', 'Appliquer une pression directe et continue sur la blessure avec un tissu propre', 'Aplicar compressió directa i contínua sobre la ferida amb un drap net', 'Påfør direkte og vedvarende tryk på såret med et rent klæde');
  trad(96,  'paso.18.titulo',    'paso',
    'Añadir capas', 'Add layers',
    'Legg til lag', 'Ajouter des couches', 'Afegir capes', 'Tilføj lag');
  trad(97,  'paso.18.contenido', 'paso',
    'Si la sangre empapa el paño, añadir más capas sin quitar las anteriores', 'If blood soaks through, add more layers without removing the previous ones',
    'Hvis blodet gjennombløter klede, legg til flere lag uten å fjerne de forrige', 'Si le sang imprègne le tissu, ajouter plus de couches sans enlever les précédentes', 'Si la sang empapa el drap, afegir més capes sense treure les anteriors', 'Hvis blodet gennemvæder klædet, tilføj flere lag uden at fjerne de tidligere');
  trad(98,  'paso.19.titulo',    'paso',
    'Elevar extremidad', 'Elevate the limb',
    'Løft ekstremiteten', 'Élever le membre', 'Elevar extremitat', 'Løft ekstremiteten');
  trad(99,  'paso.19.contenido', 'paso',
    'Elevar la extremidad lesionada si es posible y no hay fractura', 'Elevate the injured limb if possible and there is no fracture',
    'Løft den skadede ekstremiteten hvis mulig og det ikke er brudd', 'Élever le membre blessé si possible et en l\'absence de fracture', 'Elevar l\'extremitat lesionada si és possible i no hi ha fractura', 'Løft den skadede ekstremitet, hvis muligt og der ikke er brud');

  // herramientas (100-113)
  trad(100, 'herramienta.1.nombre',      'herramienta',
    'Asistente llamada 112', '112 Call Assistant',
    'Assistent for 112-anrop', 'Assistant appel 112', 'Assistent trucada 112', 'Assistent til 112-opkald');
  trad(101, 'herramienta.1.descripcion', 'herramienta',
    'Geolocalización automática y guía estructurada para comunicarte con emergencias', 'Automatic geolocation and structured guide to communicate with emergency services',
    'Automatisk geolokalisering og strukturert guide for å kommunisere med nødetjenester', 'Géolocalisation automatique et guide structuré pour communiquer avec les secours', 'Geolocalització automàtica i guia estructurada per comunicar-te amb emergències', 'Automatisk geolokalisering og struktureret guide til at kommunikere med nødtjenester');
  trad(102, 'herramienta.2.nombre',      'herramienta',
    'Asistente de RCP', 'CPR Assistant',
    'HLR-assistent', 'Assistant RCP', 'Assistent de RCP', 'HLR-assistent');
  trad(103, 'herramienta.2.descripcion', 'herramienta',
    'Metrónomo 100 rpm, medidor de profundidad, temporizador de ciclos y contador', '100 bpm metronome, depth meter, cycle timer and counter',
    'Metronom 100 bpm, dybdemåler, syklustimer og teller', 'Métronome 100 bpm, mesureur de profondeur, minuteur de cycles et compteur', 'Metrònom 100 rpm, mesurador de profunditat, temporitzador de cicles i comptador', 'Metronom 100 bpm, dybdemåler, cyklustimer og tæller');
  trad(104, 'herramienta.3.nombre',      'herramienta',
    'Medidor de frecuencia cardíaca', 'Heart rate monitor',
    'Pulsmåler', 'Mesureur de fréquence cardiaque', 'Mesurador de freqüència cardíaca', 'Pulsmåler');
  trad(105, 'herramienta.3.descripcion', 'herramienta',
    'Medición de la frecuencia cardíaca por fotopletismografía (cámara)', 'Heart rate measurement by photoplethysmography (camera)',
    'Måling av hjerterytme via fotoplethysmografi (kamera)', 'Mesure de la fréquence cardiaque par photopléthysmographie (caméra)', 'Mesura de la freqüència cardíaca per fotopletismografia (càmera)', 'Måling af hjerterytme via fotoplethysmografi (kamera)');
  trad(106, 'herramienta.4.nombre',      'herramienta',
    'Test de detección de Ictus', 'Stroke detection test',
    'Test for slagdeteksjon', 'Test de détection d\'AVC', 'Test de detecció d\'Ictus', 'Test for slagtilfælde-detektion');
  trad(107, 'herramienta.4.descripcion', 'herramienta',
    'Método FAST para identificar rápidamente un posible accidente cerebrovascular', 'FAST method to quickly identify a possible stroke',
    'FAST-metoden for raskt å identifisere et mulig hjerneslag', 'Méthode FAST pour identifier rapidement un possible AVC', 'Mètode FAST per identificar ràpidament un possible accident cerebrovascular', 'FAST-metoden til hurtigt at identificere et muligt slagtilfælde');
  trad(108, 'herramienta.5.nombre',      'herramienta',
    'Calculadora de quemaduras', 'Burns calculator',
    'Brannskadekalkulator', 'Calculateur de brûlures', 'Calculadora de cremades', 'Brandsårsberegner');
  trad(109, 'herramienta.5.descripcion', 'herramienta',
    'Estima el porcentaje de superficie corporal quemada con la Regla de los 9', 'Estimates the percentage of burned body surface using the Rule of Nines',
    'Estimerer prosentandelen av forbrent kroppsoverflate med 9-regelen', 'Estime le pourcentage de surface corporelle brûlée avec la Règle des 9', 'Estima el percentatge de superfície corporal cremada amb la Regla dels 9', 'Estimerer procentdelen af forbrændt kropsoverflade med 9-reglen');
  trad(110, 'herramienta.6.nombre',      'herramienta',
    'Registro de exploración secundaria', 'Secondary survey log',
    'Sekundærundersøkelseslogg', 'Registre d\'examen secondaire', 'Registre d\'exploració secundària', 'Log over sekundær undersøgelse');
  trad(111, 'herramienta.6.descripcion', 'herramienta',
    'Anota signos, síntomas y observaciones para entregar al personal sanitario', 'Record signs, symptoms and observations for medical personnel',
    'Noter tegn, symptomer og observasjoner for å gi til helsepersonell', 'Note les signes, symptômes et observations pour les remettre au personnel médical', 'Anota signes, símptomes i observacions per lliurar al personal sanitari', 'Notér tegn, symptomer og observationer til udlevering til sundhedspersonalet');
  trad(112, 'herramienta.7.nombre',      'herramienta',
    'Ficha médica de emergencia', 'Emergency medical record',
    'Medisinsk nødkort', 'Fiche médicale d\'urgence', 'Fitxa mèdica d\'emergència', 'Medicinsk nødkort');
  trad(113, 'herramienta.7.descripcion', 'herramienta',
    'Alergias, medicación y contactos de emergencia guardados en el dispositivo', 'Allergies, medication and emergency contacts stored on the device',
    'Allergier, medisinering og nødkontakter lagret på enheten', 'Allergies, médicaments et contacts d\'urgence enregistrés sur l\'appareil', 'Al·lèrgies, medicació i contactes d\'emergència guardats al dispositiu', 'Allergier, medicin og nødkontakter gemt på enheden');
  trad(213, 'herramienta.8.nombre',      'herramienta',
    'Maniobra de Heimlich', 'Heimlich Maneuver',
    'Heimlich-manøver', 'Manœuvre de Heimlich', 'Maniobra de Heimlich', 'Heimlich-manøvre');
  trad(214, 'herramienta.8.descripcion', 'herramienta',
    'Protocolo paso a paso para actuar ante un atragantamiento en adultos, niños y bebés', 'Step-by-step protocol for choking in adults, children and babies',
    'Trinnvis protokoll for kvelning hos voksne, barn og spedbarn', 'Protocole étape par étape pour une obstruction chez adultes, enfants et bébés', 'Protocol pas a pas per actuar davant un ofegament en adults, nens i nadons', 'Trin-for-trin protokol til håndtering af kvælning hos voksne, børn og babyer');
  trad(215, 'herramienta.9.nombre',      'herramienta',
    'Guía de quemaduras', 'Burns Guide',
    'Brannskadeguide', 'Guide des brûlures', 'Guia de cremades', 'Brandguide');
  trad(216, 'herramienta.9.descripcion', 'herramienta',
    'Identifica el grado (1.º, 2.º, 3.er) y sigue el protocolo de actuación adecuado', 'Identify the degree (1st, 2nd, 3rd) and follow the appropriate action protocol',
    'Identifiser graden (1., 2., 3.) og følg riktig handlingsprotokoll', 'Identifiez le degré (1er, 2e, 3e) et suivez le protocole d\'action approprié', 'Identifica el grau (1r, 2n, 3r) i segueix el protocol d\'actuació adequat', 'Identificer graden (1., 2., 3.) og følg den korrekte handlingsprotokol');

  // ui común (114-117)
  trad(114, 'ui.llamar112',      'ui',
    '¡LLAMA AL 112!', 'CALL 112!',
    'RING 112!', 'APPELEZ LE 112 !', 'TRUCA AL 112!', 'RING 112!');
  trad(115, 'ui.boton.anterior', 'ui',
    'Anterior', 'Previous',
    'Forrige', 'Précédent', 'Anterior', 'Forrige');
  trad(116, 'ui.boton.siguiente','ui',
    'Siguiente', 'Next',
    'Neste', 'Suivant', 'Següent', 'Næste');
  trad(117, 'ui.boton.reiniciar','ui',
    'Reiniciar', 'Restart',
    'Start på nytt', 'Recommencer', 'Reiniciar', 'Genstart');

  // navegación (118-120)
  trad(118, 'nav.inicio',       'nav',
    'Inicio', 'Home',
    'Hjem', 'Accueil', 'Inici', 'Hjem');
  trad(119, 'nav.guias',        'nav',
    'Guías', 'Guides',
    'Guider', 'Guides', 'Guies', 'Guider');
  trad(120, 'nav.herramientas', 'nav',
    'Herramientas', 'Tools',
    'Verktøy', 'Outils', 'Eines', 'Værktøjer');

  // cuestionario (121-122)
  trad(121, 'cuestionario.titulo',          'cuestionario',
    'Identificador de\nEmergencias', 'Emergency\nIdentifier',
    'Nødsituasjons-\nidentifikator', 'Identificateur\nd\'Urgences', 'Identificador\nd\'Emergències', 'Nødsituations-\nidentifikator');
  trad(122, 'cuestionario.preguntaAnterior','cuestionario',
    'Pregunta anterior', 'Previous question',
    'Forrige spørsmål', 'Question précédente', 'Pregunta anterior', 'Forrige spørgsmål');

  // resultado emergencia (123-137)
  trad(123, 'resultado.tituloApp',       'resultado',
    'Identificador de Emergencias', 'Emergency Identifier',
    'Nødsituasjonsidentifikator', 'Identificateur d\'Urgences', 'Identificador d\'Emergències', 'Nødsituationsidentifikator');
  trad(124, 'resultado.llamarAhora',     'resultado',
    'LLAMA AL 112 AHORA', 'CALL 112 NOW',
    'RING 112 NÅ', 'APPELEZ LE 112 MAINTENANT', 'TRUCA AL 112 ARA', 'RING 112 NU');
  trad(125, 'resultado.proporcionaInfo', 'resultado',
    'Proporciona esta información al operador:', 'Provide this information to the operator:',
    'Gi denne informasjonen til operatøren:', 'Fournissez ces informations à l\'opérateur :', 'Proporciona aquesta informació a l\'operador:', 'Giv disse oplysninger til operatøren:');
  trad(126, 'resultado.llamar',          'resultado',
    'Llamar al 112', 'Call 112',
    'Ring 112', 'Appeler le 112', 'Trucar al 112', 'Ring 112');
  trad(127, 'resultado.infoEspecifica',  'resultado',
    'Información específica para esta emergencia:', 'Specific information for this emergency:',
    'Spesifikk informasjon for denne nødsituasjonen:', 'Informations spécifiques pour cette urgence :', 'Informació específica per a aquesta emergència:', 'Specifik information om denne nødsituation:');
  trad(128, 'resultado.infoGeneral',     'resultado',
    'Información general a mencionar:', 'General information to mention:',
    'Generell informasjon å nevne:', 'Informations générales à mentionner :', 'Informació general a mencionar:', 'Generel information at nævne:');
  trad(129, 'resultado.noCuelgues',      'resultado',
    'NO CUELGUES. Permanece en línea y sigue las instrucciones del operador.', 'DO NOT HANG UP. Stay on the line and follow the operator\'s instructions.',
    'IKKE LEGG PÅ. Bli på linjen og følg instruksjonene fra operatøren.', 'NE RACCROCHEZ PAS. Restez en ligne et suivez les instructions de l\'opérateur.', 'NO PENGIS. Mantén la línia i segueix les instruccions de l\'operador.', 'LAG IKKE PÅ. Bliv på linjen og følg operatørens instruktioner.');
  trad(130, 'resultado.reiniciar',       'resultado',
    'Reiniciar', 'Restart',
    'Start på nytt', 'Recommencer', 'Reiniciar', 'Genstart');
  trad(131, 'resultado.verGuia',         'resultado',
    'Ver guía completa', 'View full guide',
    'Se fullstendig guide', 'Voir le guide complet', 'Veure guia completa', 'Se den komplette guide');
  trad(132, 'resultado.info1',           'resultado',
    'Ubicación exacta: calle, número, población y puntos de referencia', 'Exact location: street, number, town and landmarks',
    'Nøyaktig adresse: gate, nummer, sted og referansepunkter', 'Localisation exacte : rue, numéro, ville et points de repère', 'Ubicació exacta: carrer, número, població i punts de referència', 'Nøjagtig adresse: gade, nummer, by og referencepunkter');
  trad(133, 'resultado.info2',           'resultado',
    'Qué ha ocurrido (accidente, desmayo, caída, etc.)', 'What happened (accident, fainting, fall, etc.)',
    'Hva som har skjedd (ulykke, besvimelse, fall, etc.)', 'Ce qui s\'est passé (accident, évanouissement, chute, etc.)', 'Què ha ocorregut (accident, desmai, caiguda, etc.)', 'Hvad der er sket (ulykke, besvimelse, fald, osv.)');
  trad(134, 'resultado.info3',           'resultado',
    'Número de personas afectadas', 'Number of people affected',
    'Antall berørte personer', 'Nombre de personnes affectées', 'Nombre de persones afectades', 'Antal berørte personer');
  trad(135, 'resultado.info4',           'resultado',
    'Edad aproximada de la víctima', 'Approximate age of the victim',
    'Omtrentlig alder på offeret', 'Âge approximatif de la victime', 'Edat aproximada de la víctima', 'Omtrentlig alder på offeret');
  trad(136, 'resultado.info5',           'resultado',
    'Si está consciente o inconsciente', 'Whether conscious or unconscious',
    'Om vedkommende er bevisst eller bevisstløs', 'Si elle est consciente ou inconsciente', 'Si està conscient o inconscient', 'Om vedkommende er bevidst eller bevidstløs');
  trad(137, 'resultado.info6',           'resultado',
    'Si respira o no respira', 'Whether breathing or not',
    'Om vedkommende puster eller ikke puster', 'Si elle respire ou ne respire pas', 'Si respira o no respira', 'Om vedkommende vejrtrækker eller ikke');

  // guías list (138-140)
  trad(138, 'guias.titulo',      'guias',
    'Guías de Emergencias', 'Emergency Guides',
    'Nødguider', 'Guides d\'Urgences', 'Guies d\'Emergències', 'Nødguider');
  trad(139, 'guias.subtitulo',   'guias',
    'Selecciona la emergencia para ver la guía completa', 'Select an emergency to see the full guide',
    'Velg nødsituasjonen for å se den fullstendige guiden', 'Sélectionnez l\'urgence pour voir le guide complet', 'Selecciona l\'emergència per veure la guia completa', 'Vælg nødsituationen for at se den komplette guide');
  trad(140, 'guias.tocaParaVer', 'guias',
    'Toca para ver la guía de actuación', 'Tap to view the action guide',
    'Trykk for å se handlingsguiden', 'Appuyez pour voir le guide d\'action', 'Toca per veure la guia d\'actuació', 'Tryk for at se handlingsguiden');

  // guía detalle (141-144)
  trad(141, 'guia.comoDetectarlo', 'guia',
    'Cómo detectarlo', 'How to detect it',
    'Hvordan oppdage det', 'Comment le détecter', 'Com detectar-ho', 'Sådan opdager du det');
  trad(142, 'guia.comoActuar',     'guia',
    'Cómo actuar', 'How to act',
    'Hvordan handle', 'Comment agir', 'Com actuar', 'Sådan handler du');
  trad(143, 'guia.pasosASeguir',   'guia',
    'Pasos a seguir', 'Steps to follow',
    'Trinn å følge', 'Étapes à suivre', 'Passos a seguir', 'Trin at følge');
  trad(144, 'guia.todosLosPasos',  'guia',
    'Todos los pasos:', 'All steps:',
    'Alle trinn:', 'Toutes les étapes :', 'Tots els passos:', 'Alle trin:');

  // herramientas list (145-151)
  trad(145, 'herramientas.titulo',         'herramientas',
    'Herramientas', 'Tools',
    'Verktøy', 'Outils', 'Eines', 'Værktøjer');
  trad(146, 'herramientas.subtitulo',       'herramientas',
    'Herramientas interactivas de soporte', 'Interactive support tools',
    'Interaktive støtteverktøy', 'Outils interactifs de support', 'Eines interactives de suport', 'Interaktive støtteværktøjer');
  trad(147, 'herramientas.cat.alerta',      'herramientas',
    'Gestión de Alerta y Ubicación', 'Alert and Location Management',
    'Varslings- og posisjonsadministrasjon', 'Gestion des Alertes et de la Localisation', 'Gestió d\'Alerta i Ubicació', 'Alarm- og lokationsstyring');
  trad(148, 'herramientas.cat.reaccion',    'herramientas',
    'Guías de Reacción Inmediata', 'Immediate Reaction Guides',
    'Guider for umiddelbar reaksjon', 'Guides de Réaction Immédiate', 'Guies de Reacció Immediata', 'Guider til øjeblikkelig reaktion');
  trad(149, 'herramientas.cat.diagnostico', 'herramientas',
    'Herramientas de Identificación y Diagnóstico', 'Identification and Diagnosis Tools',
    'Identifikasjons- og diagnoseverktøy', 'Outils d\'Identification et de Diagnostic', 'Eines d\'Identificació i Diagnòstic', 'Identificerings- og diagnoseværktøjer');
  trad(150, 'herramientas.cat.info',        'herramientas',
    'Información Médica Crítica', 'Critical Medical Information',
    'Kritisk medisinsk informasjon', 'Informations Médicales Critiques', 'Informació Mèdica Crítica', 'Kritisk medicinsk information');
  trad(151, 'herramientas.aviso',           'herramientas',
    'ℹ Acerca de las herramientas\n\nEstas herramientas aplican el protocolo PAS (Proteger-Alertar-Socorrer) y están diseñadas para asistir en situaciones de emergencia. Son de carácter orientativo y no sustituyen la atención médica profesional ni la llamada al 112.',
    'ℹ About the tools\n\nThese tools apply the PAS protocol (Protect-Alert-Assist) and are designed to assist in emergency situations. They are for guidance only and do not replace professional medical care or calling 112.',
    'ℹ Om verktøyene\n\nDisse verktøyene bruker PAS-protokollen (Beskytte-Varsle-Hjelpe) og er utformet for å hjelpe i nødsituasjoner. De er veiledende og erstatter ikke profesjonell medisinsk hjelp eller oppringning til 112.',
    'ℹ À propos des outils\n\nCes outils appliquent le protocole PAS (Protéger-Alerter-Secourir) et sont conçus pour aider dans les situations d\'urgence. Ils sont indicatifs et ne remplacent pas les soins médicaux professionnels ni l\'appel au 112.',
    'ℹ Sobre les eines\n\nAquestes eines apliquen el protocol PAS (Protegir-Alertar-Socórrer) i estan dissenyades per assistir en situacions d\'emergència. Són d\'orientació i no substitueixen l\'atenció mèdica professional ni la trucada al 112.',
    'ℹ Om værktøjerne\n\nDisse værktøjer anvender PAS-protokollen (Beskytte-Advare-Hjælpe) og er designet til at assistere i nødsituationer. De er vejledende og erstatter ikke professionel lægehjælp eller opkald til 112.');

  // configuración (152-184)
  trad(152, 'config.titulo',               'config',
    'Configuración', 'Settings',
    'Innstillinger', 'Paramètres', 'Configuració', 'Indstillinger');
  trad(153, 'config.idioma',               'config',
    'Idioma', 'Language',
    'Språk', 'Langue', 'Idioma', 'Sprog');
  trad(154, 'config.disponible',           'config',
    'Disponible', 'Available',
    'Tilgjengelig', 'Disponible', 'Disponible', 'Tilgængeligt');
  trad(155, 'config.noDescargado',         'config',
    'No descargado', 'Not downloaded',
    'Ikke lastet ned', 'Non téléchargé', 'No descarregat', 'Ikke downloadet');
  trad(156, 'config.apariencia',           'config',
    'Apariencia', 'Appearance',
    'Utseende', 'Apparence', 'Aparença', 'Udseende');
  trad(157, 'config.tamanoLetra',          'config',
    'Tamaño de letra', 'Font size',
    'Skriftstørrelse', 'Taille de la police', 'Mida de lletra', 'Skriftstørrelse');
  trad(158, 'config.tamano.pequeño',       'config',
    'Pequeño', 'Small',
    'Liten', 'Petit', 'Petit', 'Lille');
  trad(159, 'config.tamano.reducido',      'config',
    'Reducido', 'Reduced',
    'Redusert', 'Réduit', 'Reduït', 'Reduceret');
  trad(160, 'config.tamano.normal',        'config',
    'Normal', 'Normal',
    'Normal', 'Normal', 'Normal', 'Normal');
  trad(161, 'config.tamano.grande',        'config',
    'Grande', 'Large',
    'Stor', 'Grand', 'Gran', 'Stor');
  trad(162, 'config.tamano.muyGrande',     'config',
    'Muy grande', 'Very large',
    'Svært stor', 'Très grand', 'Molt gran', 'Meget stor');
  trad(163, 'config.vistaPrevia',          'config',
    'Vista previa del texto en la aplicación.', 'Preview of text in the app.',
    'Forhåndsvisning av tekst i appen.', 'Aperçu du texte dans l\'application.', 'Vista prèvia del text a l\'aplicació.', 'Forhåndsvisning af tekst i appen.');
  trad(164, 'config.datosLocales',         'config',
    'Datos locales', 'Local data',
    'Lokale data', 'Données locales', 'Dades locals', 'Lokale data');
  trad(165, 'config.avisoLegal',           'config',
    'Aviso legal', 'Legal notice',
    'Juridisk merknad', 'Mentions légales', 'Avís legal', 'Juridisk meddelelse');
  trad(166, 'config.avisoAceptado',        'config',
    'Aceptado', 'Accepted',
    'Akseptert', 'Accepté', 'Acceptat', 'Accepteret');
  trad(167, 'config.avisoNoAceptado',      'config',
    'No aceptado todavía', 'Not yet accepted',
    'Ikke akseptert ennå', 'Pas encore accepté', 'No acceptat encara', 'Endnu ikke accepteret');
  trad(168, 'config.restablecer',          'config',
    'Restablecer', 'Reset',
    'Tilbakestill', 'Réinitialiser', 'Restablir', 'Nulstil');
  trad(169, 'config.fichaMedica',          'config',
    'Ficha médica', 'Medical record',
    'Medisinsk kort', 'Fiche médicale', 'Fitxa mèdica', 'Medicinsk kort');
  trad(170, 'config.eliminarDatos',        'config',
    'Eliminar datos guardados localmente', 'Delete locally saved data',
    'Slett lokalt lagrede data', 'Supprimer les données enregistrées localement', 'Eliminar dades guardades localment', 'Slet lokalt gemte data');
  trad(171, 'config.borrar',               'config',
    'Borrar', 'Delete',
    'Slett', 'Supprimer', 'Esborrar', 'Slet');
  trad(172, 'config.acercaDe',             'config',
    'Acerca de la aplicación', 'About the app',
    'Om appen', 'À propos de l\'application', 'Sobre l\'aplicació', 'Om appen');
  trad(173, 'config.version',              'config',
    'Versión', 'Version',
    'Versjon', 'Version', 'Versió', 'Version');
  trad(174, 'config.autor',                'config',
    'Autor', 'Author',
    'Forfatter', 'Auteur', 'Autor', 'Forfatter');
  trad(175, 'config.proyecto',             'config',
    'Proyecto', 'Project',
    'Prosjekt', 'Projet', 'Projecte', 'Projekt');
  trad(176, 'config.tutor',                'config',
    'Tutor', 'Tutor',
    'Veileder', 'Tuteur', 'Tutor', 'Vejleder');
  trad(177, 'config.infoLegal',            'config',
    'Información legal', 'Legal information',
    'Juridisk informasjon', 'Informations légales', 'Informació legal', 'Juridisk information');
  trad(178, 'config.avisoImportante',      'config',
    'Aviso importante', 'Important notice',
    'Viktig merknad', 'Avis important', 'Avís important', 'Vigtig meddelelse');
  trad(179, 'config.avisoImportanteTexto', 'config',
    'Esta aplicación proporciona información orientativa de primeros auxilios. No sustituye la atención médica profesional ni la llamada al 112.',
    'This application provides guidance on first aid. It does not replace professional medical care or calling 112.',
    'Denne appen gir veiledende informasjon om førstehjelp. Den erstatter ikke profesjonell medisinsk hjelp eller oppringning til 112.',
    'Cette application fournit des informations indicatives de premiers secours. Elle ne remplace pas les soins médicaux professionnels ni l\'appel au 112.',
    'Aquesta aplicació proporciona informació orientativa de primers auxilis. No substitueix l\'atenció mèdica professional ni la trucada al 112.',
    'Denne app giver vejledende information om førstehjælp. Den erstatter ikke professionel lægehjælp eller opkald til 112.');
  trad(180, 'config.privacidad',           'config',
    'Privacidad', 'Privacy',
    'Personvern', 'Confidentialité', 'Privacitat', 'Privatliv');
  trad(181, 'config.privacidadTexto',      'config',
    'La ficha médica y las observaciones de exploración se almacenan únicamente en tu dispositivo y no se envían a ningún servidor externo.',
    'The medical record and examination observations are stored only on your device and are not sent to any external server.',
    'Det medisinske kortet og undersøkelsesobservasjoner lagres kun på enheten din og sendes ikke til noen ekstern server.',
    'La fiche médicale et les observations d\'examen sont stockées uniquement sur votre appareil et ne sont pas envoyées à un serveur externe.',
    'La fitxa mèdica i les observacions d\'exploració s\'emmagatzemen únicament al teu dispositiu i no s\'envien a cap servidor extern.',
    'Det medicinske kort og undersøgelsesobservationer gemmes kun på din enhed og sendes ikke til nogen ekstern server.');
  trad(182, 'config.sincContenido',        'config',
    'Sincronización de contenido', 'Content synchronization',
    'Innholdssynkronisering', 'Synchronisation du contenu', 'Sincronització de contingut', 'Indholdssynkronisering');
  trad(183, 'config.sincContenidoTexto',   'config',
    'Las guías y el árbol de emergencias se sincronizan con el servidor para mantenerse actualizados. No se recogen datos personales.',
    'The guides and emergency decision tree are synchronized with the server to stay updated. No personal data is collected.',
    'Guidene og nødtredet synkroniseres med serveren for å holde seg oppdatert. Ingen personlige data samles inn.',
    'Les guides et l\'arbre d\'urgences sont synchronisés avec le serveur pour rester à jour. Aucune donnée personnelle n\'est collectée.',
    'Les guies i l\'arbre d\'emergències se sincronitzen amb el servidor per mantenir-se actualitzats. No es recullen dades personals.',
    'Guiderne og nødtræet synkroniseres med serveren for at holde sig opdateret. Der indsamles ingen personlige data.');
  trad(184, 'config.cargandoIdiomas',      'config',
    'Cargando idiomas...', 'Loading languages...',
    'Laster inn språk...', 'Chargement des langues...', 'Carregant idiomes...', 'Indlæser sprog...');

  // diálogos (185-192)
  trad(185, 'dialog.cancelar',          'dialog',
    'Cancelar', 'Cancel',
    'Avbryt', 'Annuler', 'Cancel·lar', 'Annuller');
  trad(186, 'dialog.confirmar',         'dialog',
    'Confirmar', 'Confirm',
    'Bekreft', 'Confirmer', 'Confirmar', 'Bekræft');
  trad(187, 'dialog.restablecerTitulo', 'dialog',
    'Restablecer aviso legal', 'Reset legal notice',
    'Tilbakestill juridisk merknad', 'Réinitialiser les mentions légales', 'Restablir avís legal', 'Nulstil juridisk meddelelse');
  trad(188, 'dialog.restablecerTexto',  'dialog',
    'El aviso legal se mostrará de nuevo la próxima vez que abras la aplicación. ¿Continuar?',
    'The legal notice will be shown again the next time you open the app. Continue?',
    'Den juridiske merknaden vises igjen neste gang du åpner appen. Fortsette?',
    'Les mentions légales s\'afficheront à nouveau la prochaine fois que vous ouvrirez l\'application. Continuer ?',
    'L\'avís legal es mostrarà de nou la propera vegada que obris l\'aplicació. Continuar?',
    'Den juridiske meddelelse vises igen næste gang du åbner appen. Fortsæt?');
  trad(189, 'dialog.restablecidoMsg',   'dialog',
    'Aviso legal restablecido. Se mostrará al reiniciar la app.',
    'Legal notice reset. It will be shown on app restart.',
    'Juridisk merknad tilbakestilt. Vises ved omstart av appen.',
    'Mentions légales réinitialisées. Elles s\'afficheront au redémarrage de l\'app.',
    'Avís legal restablit. Es mostrarà en reiniciar l\'app.',
    'Juridisk meddelelse nulstillet. Vises ved genstart af appen.');
  trad(190, 'dialog.borrarFichaTitulo', 'dialog',
    'Borrar ficha médica', 'Delete medical record',
    'Slett medisinsk kort', 'Supprimer la fiche médicale', 'Esborrar fitxa mèdica', 'Slet medicinsk kort');
  trad(191, 'dialog.borrarFichaTexto',  'dialog',
    'Se eliminarán todos los datos de tu ficha médica guardados en el dispositivo. Esta acción no se puede deshacer.',
    'All your medical record data saved on your device will be deleted. This action cannot be undone.',
    'Alle data fra det medisinske kortet ditt lagret på enheten vil bli slettet. Denne handlingen kan ikke angres.',
    'Toutes les données de votre fiche médicale enregistrées sur l\'appareil seront supprimées. Cette action ne peut pas être annulée.',
    'S\'eliminaran totes les dades de la teva fitxa mèdica guardades al dispositiu. Aquesta acció no es pot desfer.',
    'Alle data fra dit medicinske kort gemt på enheden vil blive slettet. Denne handling kan ikke fortrydes.');
  trad(192, 'dialog.fichaEliminada',    'dialog',
    'Ficha médica eliminada.', 'Medical record deleted.',
    'Medisinsk kort slettet.', 'Fiche médicale supprimée.', 'Fitxa mèdica eliminada.', 'Medicinsk kort slettet.');

  // cuenta y apariencia (193-202)
  trad(193, 'config.iniciarSesion',         'config',
    'Iniciar sesión', 'Sign in',
    'Logg inn', 'Se connecter', 'Iniciar sessió', 'Log ind');
  trad(194, 'config.cuenta',                'config',
    'Cuenta', 'Account',
    'Konto', 'Compte', 'Compte', 'Konto');
  trad(195, 'config.sesionIniciada',        'config',
    'Sesión iniciada', 'Signed in',
    'Innlogget', 'Connecté', 'Sessió iniciada', 'Logget ind');
  trad(196, 'config.cerrarSesion',          'config',
    'Cerrar sesión', 'Sign out',
    'Logg ut', 'Se déconnecter', 'Tancar sessió', 'Log ud');
  trad(197, 'config.cuentaSubtitulo',       'config',
    'Sincroniza tu ficha médica entre dispositivos', 'Sync your medical card between devices',
    'Synkroniser ditt medisinske kort mellom enheter', 'Synchronisez votre fiche médicale entre appareils', 'Sincronitza la teva fitxa mèdica entre dispositius', 'Synkroniser dit medicinske kort mellem enheder');
  trad(198, 'config.paleta',                'config',
    'Color de la aplicación', 'App color',
    'Appens farge', 'Couleur de l\'application', 'Color de l\'aplicació', 'Appens farve');
  trad(199, 'config.paleta.seleccionar',    'config',
    'Selecciona un color', 'Select a color',
    'Velg en farge', 'Sélectionnez une couleur', 'Selecciona un color', 'Vælg en farve');
  trad(200, 'config.modoOscuro',            'config',
    'Modo oscuro', 'Dark mode',
    'Mørk modus', 'Mode sombre', 'Mode fosc', 'Mørk tilstand');
  trad(201, 'config.modoOscuro.activado',   'config',
    'Activado', 'On',
    'Aktivert', 'Activé', 'Activat', 'Aktiveret');
  trad(202, 'config.modoOscuro.desactivado','config',
    'Desactivado', 'Off',
    'Deaktivert', 'Désactivé', 'Desactivat', 'Deaktiveret');

  // diálogos de sesión (203-205)
  trad(203, 'dialog.cerrarSesionTitulo',    'dialog',
    'Cerrar sesión', 'Sign out',
    'Logg ut', 'Se déconnecter', 'Tancar sessió', 'Log ud');
  trad(204, 'dialog.cerrarSesionTexto',     'dialog',
    '¿Seguro que quieres cerrar sesión?', 'Are you sure you want to sign out?',
    'Er du sikker på at du vil logge ut?', 'Êtes-vous sûr de vouloir vous déconnecter ?', 'Estàs segur que vols tancar la sessió?', 'Er du sikker på, at du vil logge ud?');
  trad(205, 'config.tamano.extraGrande',    'config',
    'Extra grande', 'Extra large',
    'Ekstra stor', 'Extra grand', 'Extra gran', 'Ekstra stor');

  // aviso legal (206-212)
  trad(206, 'avisoLegal.titulo',  'avisoLegal',
    'Aviso Legal Importante', 'Important Legal Notice',
    'Viktig Juridisk Merknad', 'Avis Légal Important', 'Avís Legal Important', 'Vigtig Juridisk Meddelelse');
  trad(207, 'avisoLegal.aviso.1', 'avisoLegal',
    'Esta aplicación es una herramienta de APOYO educativo y orientativo.',
    'This app is an educational and guidance SUPPORT tool.',
    'Denne appen er et STØTTENDE pedagogisk og veiledende verktøy.',
    'Cette application est un outil de SOUTIEN éducatif et indicatif.',
    'Aquesta aplicació és una eina de SUPORT educatiu i orientatiu.',
    'Denne app er et STØTTENDE pædagogisk og vejledende værktøj.');
  trad(208, 'avisoLegal.aviso.2', 'avisoLegal',
    'NO SUSTITUYE la atención médica profesional ni la llamada obligatoria a los servicios de emergencia.',
    'It does NOT replace professional medical care or the mandatory call to emergency services.',
    'Den ERSTATTER IKKE profesjonell medisinsk hjelp eller den obligatoriske oppringningen til nødetjenestene.',
    'Elle NE REMPLACE PAS les soins médicaux professionnels ni l\'appel obligatoire aux services d\'urgence.',
    'NO SUBSTITUEIX l\'atenció mèdica professional ni la trucada obligatòria als serveis d\'emergència.',
    'Den ERSTATTER IKKE professionel lægehjælp eller det obligatoriske opkald til nødtjenester.');
  trad(209, 'avisoLegal.aviso.3', 'avisoLegal',
    'Ante cualquier emergencia, SIEMPRE llama primero al 112 o al número de emergencias de tu país.',
    'In any emergency, ALWAYS call 112 first or your country\'s emergency number.',
    'Ved enhver nødsituasjon, RING ALLTID 112 eller ditt lands nødnummer først.',
    'Face à toute urgence, APPELEZ TOUJOURS d\'abord le 112 ou le numéro d\'urgence de votre pays.',
    'Davant qualsevol emergència, TRUCA SEMPRE primer al 112 o al número d\'emergències del teu país.',
    'Ved enhver nødsituation, RING ALTID 112 eller dit lands nødnummer først.');
  trad(210, 'avisoLegal.aviso.4', 'avisoLegal',
    'El uso de esta aplicación es bajo tu propia responsabilidad.',
    'Use of this application is at your own responsibility.',
    'Bruken av denne appen skjer på eget ansvar.',
    'L\'utilisation de cette application est sous votre propre responsabilité.',
    'L\'ús d\'aquesta aplicació és sota la teva pròpia responsabilitat.',
    'Brug af denne app sker på eget ansvar.');
  trad(211, 'avisoLegal.aceptar', 'avisoLegal',
    'Entiendo y acepto', 'I understand and accept',
    'Jeg forstår og aksepterer', 'Je comprends et j\'accepte', 'Entenc i accepto', 'Jeg forstår og accepterer');
  trad(212, 'avisoLegal.de',      'avisoLegal',
    'de', 'of',
    'av', 'de', 'de', 'af');

  // pantalla de login (391-403)
  trad(391, 'login.titulo',                'login',
    'Mi cuenta', 'My account',
    'Min konto', 'Mon compte', 'El meu compte', 'Min konto');
  trad(392, 'login.iniciarSesion',         'login',
    'Iniciar sesión', 'Sign in',
    'Logg inn', 'Se connecter', 'Inicia sessió', 'Log ind');
  trad(393, 'login.crearCuenta',           'login',
    'Crear cuenta', 'Create account',
    'Opprett konto', 'Créer un compte', 'Crea un compte', 'Opret konto');
  trad(394, 'login.correo',                'login',
    'Correo electrónico', 'Email',
    'E-post', 'E-mail', 'Correu electrònic', 'E-mail');
  trad(395, 'login.contrasena',            'login',
    'Contraseña', 'Password',
    'Passord', 'Mot de passe', 'Contrasenya', 'Adgangskode');
  trad(396, 'login.errorEmailInvalido',    'login',
    'El email no tiene un formato válido.',
    'Invalid email format.',
    'Ugyldig e-postformat.',
    'Format d\'e-mail invalide.',
    'El correu no té un format vàlid.',
    'Ugyldigt e-mailformat.');
  trad(397, 'login.errorContrasenaCorta',  'login',
    'Mínimo 6 caracteres', 'Minimum 6 characters',
    'Minst 6 tegn', 'Minimum 6 caractères', 'Mínim 6 caràcters', 'Mindst 6 tegn');
  trad(398, 'login.errorCredenciales',     'login',
    'Email o contraseña incorrectos.',
    'Incorrect email or password.',
    'Feil e-post eller passord.',
    'E-mail ou mot de passe incorrect.',
    'Correu o contrasenya incorrectes.',
    'Forkert e-mail eller adgangskode.');
  trad(399, 'login.errorEmailEnUso',       'login',
    'Este email ya tiene una cuenta.',
    'This email is already in use.',
    'Denne e-posten er allerede i bruk.',
    'Cet e-mail est déjà utilisé.',
    'Aquest correu ja té un compte.',
    'Denne e-mail er allerede i brug.');
  trad(400, 'login.errorContrasenaDebil',  'login',
    'La contraseña debe tener al menos 6 caracteres.',
    'Password must be at least 6 characters.',
    'Passordet må ha minst 6 tegn.',
    'Le mot de passe doit comporter au moins 6 caractères.',
    'La contrasenya ha de tenir almenys 6 caràcters.',
    'Adgangskoden skal være mindst 6 tegn.');
  trad(401, 'login.errorRed',              'login',
    'Sin conexión. Comprueba tu internet.',
    'No connection. Check your internet.',
    'Ingen tilkobling. Sjekk internett.',
    'Pas de connexion. Vérifiez internet.',
    'Sense connexió. Comprova internet.',
    'Ingen forbindelse. Tjek internettet.');
  trad(402, 'login.sinCuenta',             'login',
    'Continuar sin cuenta', 'Continue without account',
    'Fortsett uten konto', 'Continuer sans compte', 'Continua sense compte', 'Fortsæt uden konto');
  trad(403, 'login.infoCuenta',            'login',
    'Tu cuenta te permite identificarte en la aplicación y mantener un registro de actividad de tus dispositivos.',
    'Your account lets you identify yourself in the app and keep an activity log of your devices.',
    'Kontoen din lar deg identifisere deg i appen og holde en aktivitetslogg over enhetene dine.',
    'Votre compte vous permet de vous identifier dans l\'application et de conserver un journal d\'activité de vos appareils.',
    'El teu compte et permet identificar-te a l\'aplicació i mantenir un registre d\'activitat dels teus dispositius.',
    'Din konto giver dig mulighed for at identificere dig i appen og føre en aktivitetslog over dine enheder.');

  // tamaños de letra extragrandes (404-406)
  trad(404, 'config.tamano.gigante', 'config',
    'Gigante', 'Huge',
    'Gigantisk', 'Géant', 'Gegant', 'Kæmpe');
  trad(405, 'config.tamano.enorme',  'config',
    'Enorme', 'Massive',
    'Enorm', 'Énorme', 'Enorme', 'Enorm');
  trad(406, 'config.tamano.maximo',  'config',
    'Máximo', 'Maximum',
    'Maks', 'Maximum', 'Màxim', 'Maks');

  // cuestionario web (407)
  trad(407, 'cuestionario.pregunta', 'cuestionario',
    'Evalúa la situación', 'Evaluate the situation',
    'Vurder situasjonen', 'Évaluez la situation', 'Avalua la situació', 'Vurder situationen');

  // ── Pantallas internas de herramientas (217-390) ──────────────────────────
  // Shared UI
  trad(217, 'ui.si',       'ui', 'Sí',        'Yes',       'Ja',      'Oui',      'Sí',         'Ja');
  trad(218, 'ui.no',       'ui', 'No',         'No',        'Nei',     'Non',      'No',         'Nej');
  trad(219, 'ui.cancelar', 'ui', 'Cancelar',   'Cancel',    'Avbryt',  'Annuler',  'Cancel·lar', 'Annuller');
  trad(220, 'ui.guardar',  'ui', 'Guardar',    'Save',      'Lagre',   'Enregistrer', 'Desar',   'Gem');

  // H1 Asistente 112
  trad(221, 'herramienta.1.llamar_112',           'herramienta', 'Llamar al 112',   'Call 112',             'Ring 112',                      'Appeler le 112',           'Trucar al 112',              'Ring 112');
  trad(222, 'herramienta.1.ubicacion_titulo',      'herramienta', 'Tu ubicación actual', 'Your current location', 'Din nåværende plassering',  'Votre position actuelle',  'La teva ubicació actual',    'Din aktuelle placering');
  trad(223, 'herramienta.1.gps_cargando',          'herramienta', 'Obteniendo ubicación...', 'Getting location...', 'Henter plassering...', 'Obtention de la position...', 'Obtenint ubicació...', 'Henter placering...');
  trad(224, 'herramienta.1.gps_ok_titulo',         'herramienta', 'Ubicación obtenida', 'Location obtained', 'Plassering hentet', 'Position obtenue', 'Ubicació obtinguda', 'Placering hentet');
  trad(225, 'herramienta.1.gps_coords_hint',       'herramienta',
    'Comparte estas coordenadas con el 112 si no puedes describir tu ubicación.',
    'Share these coordinates with 112 if you cannot describe your location.',
    'Del disse koordinatene med 112 hvis du ikke kan beskrive plasseringen din.',
    'Partagez ces coordonnées avec le 112 si vous ne pouvez pas décrire votre position.',
    'Comparteix aquestes coordenades amb el 112 si no pots descriure la teva ubicació.',
    'Del disse koordinater med 112, hvis du ikke kan beskrive din placering.');
  trad(226, 'herramienta.1.copiar_coords',         'herramienta', 'Copiar coordenadas', 'Copy coordinates', 'Kopier koordinater', 'Copier les coordonnées', 'Copiar coordenades', 'Kopiér koordinater');
  trad(227, 'herramienta.1.coords_copiadas',       'herramienta', 'Coordenadas copiadas', 'Coordinates copied', 'Koordinater kopiert', 'Coordonnées copiées', 'Coordenades copiades', 'Koordinater kopieret');
  trad(228, 'herramienta.1.ver_mapa',              'herramienta', 'Ver en el mapa', 'View on map', 'Se på kart', 'Voir sur la carte', 'Veure al mapa', 'Se på kort');
  trad(229, 'herramienta.1.actualizar',            'herramienta', 'Actualizar', 'Refresh', 'Oppdater', 'Actualiser', 'Actualitzar', 'Opdater');
  trad(230, 'herramienta.1.gps_denegado_titulo',   'herramienta', 'Permiso de ubicación denegado', 'Location permission denied', 'Posisjonstillatelse nektet', 'Permission de localisation refusée', "Permís d'ubicació denegat", 'Placeringsgodkendelse nægtet');
  trad(231, 'herramienta.1.gps_denegado_desc',     'herramienta',
    'Accede a Ajustes del dispositivo y activa los permisos de ubicación para esta app.',
    'Go to device Settings and enable location permissions for this app.',
    'Gå til enhetsinnstillinger og aktiver plasseringstillatelser for denne appen.',
    "Accédez aux paramètres de l'appareil et activez les autorisations de localisation pour cette application.",
    "Accedeix a Configuració del dispositiu i activa els permisos d'ubicació per a aquesta app.",
    'Gå til enhedsindstillinger og aktivér placeringsgodkendelser for denne app.');
  trad(232, 'herramienta.1.gps_error_titulo',      'herramienta', 'No se pudo obtener la ubicación', 'Could not get location', 'Kunne ikke hente plassering', "Impossible d'obtenir la position", "No s'ha pogut obtenir la ubicació", 'Kunne ikke hente placering');
  trad(233, 'herramienta.1.gps_error_desc',        'herramienta', 'Asegúrate de que el GPS está activo.', 'Make sure GPS is enabled.', 'Sørg for at GPS er aktivert.', 'Assurez-vous que le GPS est activé.', "Assegura't que el GPS està actiu.", 'Sørg for, at GPS er aktiveret.');
  trad(234, 'herramienta.1.reintentar',            'herramienta', 'Intentar de nuevo', 'Try again', 'Prøv igjen', 'Réessayer', 'Tornar a intentar', 'Prøv igen');
  trad(235, 'herramienta.1.abrir_ajustes',         'herramienta', 'Abrir ajustes', 'Open settings', 'Åpne innstillinger', 'Ouvrir les paramètres', 'Obrir ajustos', 'Åbn indstillinger');
  trad(236, 'herramienta.1.info_titulo',           'herramienta', 'Información a comunicar al 112', 'Information to communicate to 112', 'Informasjon som skal kommuniseres til 112', 'Informations à communiquer au 112', 'Informació a comunicar al 112', 'Information til at kommunikere til 112');
  trad(237, 'herramienta.1.campo_personas',        'herramienta', 'Número de personas afectadas', 'Number of people affected', 'Antall berørte personer', 'Nombre de personnes affectées', 'Nombre de persones afectades', 'Antal berørte personer');
  trad(238, 'herramienta.1.campo_edad',            'herramienta', 'Edad aproximada', 'Approximate age', 'Omtrentlig alder', 'Âge approximatif', 'Edat aproximada', 'Omtrentlig alder');
  trad(239, 'herramienta.1.campo_consciente',      'herramienta', '¿Está consciente?', 'Is the person conscious?', 'Er personen bevisst?', 'La personne est-elle consciente ?', 'Està conscient?', 'Er personen bevidst?');
  trad(240, 'herramienta.1.campo_respira',         'herramienta', '¿Está respirando?', 'Is the person breathing?', 'Puster personen?', 'La personne respire-t-elle ?', 'Està respirant?', 'Trækker personen vejret?');
  trad(241, 'herramienta.1.campo_lesiones',        'herramienta', 'Lesiones visibles', 'Visible injuries', 'Synlige skader', 'Blessures visibles', 'Lesions visibles', 'Synlige skader');
  trad(242, 'herramienta.1.campo_sintomas',        'herramienta', 'Síntomas que refiere la víctima', 'Symptoms reported by the victim', 'Symptomer rapportert av offeret', 'Symptômes rapportés par la victime', 'Símptomes que refereix la víctima', 'Symptomer rapporteret af offeret');
  trad(243, 'herramienta.1.campo_historial',       'herramienta', 'Historial médico relevante (si se conoce)', 'Relevant medical history (if known)', 'Relevant sykehistorie (om kjent)', 'Antécédents médicaux pertinents (si connus)', 'Historial mèdic rellevant (si es coneix)', 'Relevant sygehistorie (hvis kendt)');
  trad(244, 'herramienta.1.resumen_titulo',        'herramienta', 'Qué decir al 112', 'What to say to 112', 'Hva du skal si til 112', 'Que dire au 112', 'Què dir al 112', 'Hvad man skal sige til 112');
  trad(245, 'herramienta.1.resumen_texto',         'herramienta',
    '1. Tu ubicación exacta o las coordenadas GPS\n2. Qué ha pasado y cuántas personas están afectadas\n3. Estado de la víctima (consciente, respira)\n4. Lesiones visibles y síntomas\n5. Tu nombre y teléfono de contacto',
    '1. Your exact location or GPS coordinates\n2. What happened and how many people are affected\n3. Victim\'s condition (conscious, breathing)\n4. Visible injuries and symptoms\n5. Your name and contact phone number',
    '1. Din nøyaktige plassering eller GPS-koordinater\n2. Hva som skjedde og hvor mange som er berørt\n3. Offerets tilstand (bevisst, puster)\n4. Synlige skader og symptomer\n5. Ditt navn og kontakttelefonnummer',
    '1. Votre position exacte ou les coordonnées GPS\n2. Ce qui s\'est passé et combien de personnes sont affectées\n3. État de la victime (consciente, respire)\n4. Blessures visibles et symptômes\n5. Votre nom et numéro de téléphone de contact',
    '1. La teva ubicació exacta o les coordenades GPS\n2. Que ha passat i quantes persones estan afectades\n3. Estat de la víctima (conscient, respira)\n4. Lesions visibles i símptomes\n5. El teu nom i telèfon de contacte',
    '1. Din nøjagtige placering eller GPS-koordinater\n2. Hvad der skete og hvor mange mennesker der er berørt\n3. Offerets tilstand (bevidst, trækker vejret)\n4. Synlige skader og symptomer\n5. Dit navn og kontakttelefonummer');

  // H2 Asistente RCP
  trad(246, 'herramienta.2.ritmo',               'herramienta', 'Ritmo: 110 compresiones/minuto', 'Rhythm: 110 compressions/minute', 'Rytme: 110 kompresjoner/minutt', 'Rythme : 110 compressions/minute', 'Ritme: 110 compressions/minut', 'Rytme: 110 kompressioner/minut');
  trad(247, 'herramienta.2.instrucciones_titulo', 'herramienta', 'Instrucciones de RCP', 'CPR Instructions', 'HLR-instruksjoner', 'Instructions de RCP', 'Instruccions de RCP', 'HLR-instruktioner');
  trad(248, 'herramienta.2.pasos',               'herramienta',
    'Coloca a la persona en una superficie dura y plana\nColoca tus manos entrelazadas en el centro del pecho\nComprime con los brazos rectos, profundidad 5-6 cm\nSigue el ritmo del metrónomo: 110 compresiones/min\nCada 30 compresiones, da 2 ventilaciones si estás entrenado',
    'Place the person on a hard, flat surface\nPlace your interlocked hands in the center of the chest\nCompress with straight arms, depth 5-6 cm\nFollow the metronome rhythm: 110 compressions/min\nEvery 30 compressions, give 2 breaths if trained',
    'Legg personen på en hard og flat overflate\nPlasser hendene dine sammenlåst midt på brystkassen\nKomprimer med rette armer, dybde 5-6 cm\nFølg metronomerytmen: 110 kompresjoner/min\nFor hver 30 kompresjoner, gi 2 innblåsinger hvis du er trent',
    'Placez la personne sur une surface dure et plate\nPlacez vos mains entrelacées au centre de la poitrine\nComprimez avec les bras droits, profondeur 5-6 cm\nSuivez le rythme du métronome : 110 compressions/min\nToutes les 30 compressions, donnez 2 ventilations si vous êtes formé',
    'Col·loca la persona en una superfície dura i plana\nCol·loca les teves mans entrellaçades al centre del pit\nComprimeix amb els braços rectes, profunditat 5-6 cm\nSegueix el ritme del metrònome: 110 compressions/min\nCada 30 compressions, fes 2 ventilacions si estàs entrenat',
    'Læg personen på en hård, flad overflade\nPlacer dine sammenfiltrede hænder i midten af brystet\nKomprimer med strakte arme, dybde 5-6 cm\nFølg metronomerytmen: 110 kompressioner/min\nFor hvert 30. kompression, giv 2 indblæsninger hvis du er uddannet');
  trad(249, 'herramienta.2.compresiones_totales', 'herramienta', 'Compresiones\nTotales', 'Total\nCompressions', 'Totale\nKompresjoner', 'Compressions\nTotales', 'Compressions\nTotals', 'Totale\nKompressioner');
  trad(250, 'herramienta.2.ciclos_completados',   'herramienta', 'Ciclos\nCompletados', 'Completed\nCycles', 'Fullførte\nSykluser', 'Cycles\nCompletés', 'Cicles\nCompletats', 'Gennemførte\nCyklusser');
  trad(251, 'herramienta.2.ciclo_actual',         'herramienta', 'Ciclo Actual', 'Current Cycle', 'Nåværende syklus', 'Cycle actuel', 'Cicle actual', 'Aktuel cyklus');
  trad(252, 'herramienta.2.pausar',               'herramienta', 'Pausar', 'Pause', 'Pause', 'Pause', 'Pausa', 'Pause');
  trad(253, 'herramienta.2.iniciar',              'herramienta', 'Iniciar', 'Start', 'Start', 'Démarrer', 'Iniciar', 'Start');
  trad(254, 'herramienta.2.aviso',               'herramienta',
    '⚠ Recuerda: Continúa la RCP hasta que llegue ayuda médica o la persona recupere la respiración.',
    '⚠ Remember: Continue CPR until medical help arrives or the person resumes breathing.',
    '⚠ Husk: Fortsett HLR til medisinsk hjelp ankommer eller personen begynner å puste igjen.',
    '⚠ Rappel : Continuez la RCP jusqu\'à l\'arrivée des secours médicaux ou la reprise de la respiration.',
    '⚠ Recorda: Continua la RCP fins que arribi ajuda mèdica o la persona recuperi la respiració.',
    '⚠ Husk: Fortsæt HLR, indtil medisinsk hjælp ankommer, eller personen genvinder vejrtrækning.');

  // H3 Medidor FC
  trad(255, 'herramienta.3.aviso_titulo',        'herramienta', 'Método manual de pulsación', 'Manual pulse method', 'Manuell pulsemetode', 'Méthode manuelle de pulsation', 'Mètode manual de pulsació', 'Manuel pulsmålingsmetode');
  trad(256, 'herramienta.3.aviso_desc',          'herramienta',
    'Localiza el pulso en la muñeca o en el cuello. Pulsa el botón cada vez que notes un latido durante 15 segundos. La app calculará automáticamente las pulsaciones por minuto.',
    'Locate the pulse on the wrist or neck. Press the button each time you feel a heartbeat for 15 seconds. The app will automatically calculate beats per minute.',
    'Finn pulsen på håndleddet eller halsen. Trykk på knappen hver gang du kjenner et hjerteslag i 15 sekunder. Appen beregner automatisk slag per minutt.',
    'Localisez le pouls au poignet ou au cou. Appuyez sur le bouton chaque fois que vous sentez un battement pendant 15 secondes. L\'application calculera automatiquement les battements par minute.',
    'Localitza el pols al canell o al coll. Prem el botó cada cop que notis un batec durant 15 segons. L\'app calcularà automàticament les pulsacions per minut.',
    'Find pulsen på håndleddet eller halsen. Tryk på knappen, hver gang du mærker et hjerteslag i 15 sekunder. Appen beregner automatisk slag i minuttet.');
  trad(257, 'herramienta.3.iniciar_medicion',    'herramienta', 'Iniciar medición (15 segundos)', 'Start measurement (15 seconds)', 'Start måling (15 sekunder)', 'Démarrer la mesure (15 secondes)', 'Iniciar mesura (15 segons)', 'Start måling (15 sekunder)');
  trad(258, 'herramienta.3.instrucciones_titulo','herramienta', 'Cómo medir el pulso', 'How to measure the pulse', 'Slik måler du pulsen', 'Comment mesurer le pouls', 'Com mesurar el pols', 'Sådan måler du pulsen');
  trad(259, 'herramienta.3.instrucciones_titulos','herramienta',
    'Localiza el pulso\nColoca tus dedos\nPulsa el botón\nEspera 15 segundos',
    'Locate the pulse\nPlace your fingers\nPress the button\nWait 15 seconds',
    'Finn pulsen\nPlasser fingrene dine\nTrykk på knappen\nVent 15 sekunder',
    'Localisez le pouls\nPlacez vos doigts\nAppuyez sur le bouton\nAttendez 15 secondes',
    'Localitza el pols\nCol·loca els dits\nPrem el botó\nEspera 15 segons',
    'Find pulsen\nPlacer dine fingre\nTryk på knappen\nVent 15 sekunder');
  trad(260, 'herramienta.3.instrucciones_descs', 'herramienta',
    'En la muñeca (arteria radial) o en el cuello (arteria carótida)\nÍndice y corazón sobre la arteria. No uses el pulgar\nToca el botón grande cada vez que sientas un latido\nLa app calcula automáticamente al terminar el tiempo',
    'On the wrist (radial artery) or neck (carotid artery)\nIndex and middle finger on the artery. Do not use the thumb\nTap the large button every time you feel a heartbeat\nThe app calculates automatically when time is up',
    'På håndleddet (radialarterien) eller halsen (halsarterien)\nPeke- og langfinger på arterien. Ikke bruk tommelen\nTrykk på den store knappen hver gang du kjenner et hjerteslag\nAppen beregner automatisk når tiden er ute',
    'Au poignet (artère radiale) ou au cou (artère carotide)\nIndex et majeur sur l\'artère. N\'utilisez pas le pouce\nAppuyez sur le grand bouton chaque fois que vous sentez un battement\nL\'application calcule automatiquement à la fin du temps',
    'Al canell (artèria radial) o al coll (artèria caròtida)\nÍndex i cor sobre l\'artèria. No facis servir el polze\nToca el botó gran cada cop que sentis un batec\nL\'app calcula automàticament en acabar el temps',
    'På håndleddet (radialarterie) eller halsen (halspulsåre)\nPege- og langfinger på arterien. Brug ikke tommelfingeren\nTryk på den store knap, hver gang du mærker et hjerteslag\nAppen beregner automatisk, når tiden er gået');
  trad(261, 'herramienta.3.taps_registrados',    'herramienta', 'Taps registrados', 'Taps recorded', 'Taps registrert', 'Taps enregistrés', 'Taps registrats', 'Taps registreret');
  trad(262, 'herramienta.3.latido',              'herramienta', 'LATIDO', 'BEAT', 'SLAG', 'BATTEMENT', 'BATEC', 'SLAG');
  trad(263, 'herramienta.3.pulsa_instruccion',   'herramienta', 'Pulsa el botón con cada latido que sientas', 'Press the button with each heartbeat you feel', 'Trykk på knappen med hvert hjerteslag du kjenner', 'Appuyez sur le bouton à chaque battement que vous ressentez', 'Prem el botó amb cada batec que sentis', 'Tryk på knappen ved hvert hjerteslag, du mærker');
  trad(264, 'herramienta.3.bpm_estados',         'herramienta',
    'Muy bajo\nBajo\nNormal\nElevado\nMuy elevado',
    'Very low\nLow\nNormal\nElevated\nVery high',
    'Svært lav\nLav\nNormal\nForhøyet\nSvært høy',
    'Très bas\nBas\nNormal\nÉlevé\nTrès élevé',
    'Molt baix\nBaix\nNormal\nElevat\nMolt elevat',
    'Meget lav\nLav\nNormal\nForhøjet\nMeget høj');
  trad(265, 'herramienta.3.bpm_descs',           'herramienta',
    'Frecuencia cardíaca muy baja. Busca atención médica inmediata.\nBradicardia. Si hay síntomas como mareo o dificultad respiratoria, consulta con un médico.\nFrecuencia cardíaca en rango normal en reposo (60-100 bpm).\nTaquicardia. Si no es por actividad física reciente, consulta con un médico.\nFrecuencia cardíaca muy alta. Busca atención médica si no es por ejercicio intenso.',
    'Very low heart rate. Seek immediate medical attention.\nBradycardia. If symptoms like dizziness or difficulty breathing occur, consult a doctor.\nHeart rate in normal resting range (60-100 bpm).\nTachycardia. If not due to recent physical activity, consult a doctor.\nVery high heart rate. Seek medical attention if not due to intense exercise.',
    'Svært lav hjertefrekvens. Oppsøk øyeblikkelig legehjelp.\nBradiakardi. Hvis symptomer som svimmelhet eller pustevansker oppstår, kontakt lege.\nHjertefrekvens i normalt hvileområde (60-100 bpm).\nTakykardi. Hvis ikke på grunn av nylig fysisk aktivitet, kontakt lege.\nSvært høy hjertefrekvens. Oppsøk legehjelp hvis ikke på grunn av intensiv trening.',
    'Fréquence cardiaque très basse. Consultez immédiatement un médecin.\nBradicardie. En cas de symptômes comme des vertiges ou des difficultés respiratoires, consultez un médecin.\nFréquence cardiaque dans la plage normale au repos (60-100 bpm).\nTachycardie. Si ce n\'est pas dû à une activité physique récente, consultez un médecin.\nFréquence cardiaque très élevée. Consultez un médecin si ce n\'est pas dû à un exercice intense.',
    'Freqüència cardíaca molt baixa. Busca atenció mèdica immediata.\nBradicàrdia. Si hi ha símptomes com mareig o dificultat respiratòria, consulta un metge.\nFreqüència cardíaca en rang normal en repòs (60-100 bpm).\nTaquicàrdia. Si no és per activitat física recent, consulta un metge.\nFreqüència cardíaca molt alta. Busca atenció mèdica si no és per exercici intens.',
    'Meget lav hjertefrekvens. Søg øjeblikkelig lægehjælp.\nBradykardi. Hvis symptomer som svimmelhed eller vejrtrækningsbesvær opstår, konsulter en læge.\nHjertefrekvens i normalt hvileinterval (60-100 bpm).\nTakykardi. Hvis ikke på grund af nylig fysisk aktivitet, konsulter en læge.\nMeget høj hjertefrekvens. Søg lægehjælp, hvis det ikke skyldes intens træning.');
  trad(266, 'herramienta.3.medir_de_nuevo',      'herramienta', 'Medir de nuevo', 'Measure again', 'Mål igjen', 'Mesurer à nouveau', 'Mesurar de nou', 'Mål igen');
  trad(267, 'herramienta.3.valores_titulo',      'herramienta', 'Valores de referencia (adultos en reposo)', 'Reference values (resting adults)', 'Referanseverdier (voksne i hvile)', 'Valeurs de référence (adultes au repos)', 'Valors de referència (adults en repòs)', 'Referenceværdier (voksne i hvile)');
  trad(268, 'herramienta.3.valores_labels',      'herramienta',
    'Bradicardia\nNormal en reposo\nTaquicardia\nUrgente',
    'Bradycardia\nNormal at rest\nTachycardia\nUrgent',
    'Bradykardi\nNormal i hvile\nTakykardi\nHaster',
    'Bradycardie\nNormal au repos\nTachycardie\nUrgent',
    'Bradicàrdia\nNormal en repòs\nTaquicàrdia\nUrgent',
    'Bradykardi\nNormal i hvile\nTakykardi\nUrgent');
  trad(269, 'herramienta.3.medicion_orientativa','herramienta',
    'ℹ Medición orientativa. Para diagnóstico usa dispositivos médicos certificados.',
    'ℹ Indicative measurement. For diagnosis use certified medical devices.',
    'ℹ Veiledende måling. For diagnose bruk sertifiserte medisinske enheter.',
    'ℹ Mesure indicative. Pour le diagnostic, utilisez des dispositifs médicaux certifiés.',
    'ℹ Mesura orientativa. Per a diagnòstic usa dispositius mèdics certificats.',
    'ℹ Vejledende måling. Brug certificerede medicinske apparater til diagnostik.');
  trad(270, 'herramienta.3.seg',                 'herramienta', 'seg', 's', 's', 's', 's', 's');

  // H4 Test FAST
  trad(271, 'herramienta.4.aviso',               'herramienta',
    'Método FAST\nEl método FAST es una forma rápida de identificar un posible Ictus. Cada minuto cuenta. Si detectas algún síntoma, llama inmediatamente al 112.',
    'FAST Method\nThe FAST method is a quick way to identify a possible stroke. Every minute counts. If you detect any symptom, call 112 immediately.',
    'FAST-metoden\nFAST-metoden er en rask måte å identifisere et mulig hjerneslag på. Hvert minutt teller. Hvis du oppdager et symptom, ring 112 umiddelbart.',
    'Méthode FAST\nLa méthode FAST est un moyen rapide d\'identifier un possible AVC. Chaque minute compte. Si vous détectez un symptôme, appelez le 112 immédiatement.',
    'Mètode FAST\nEl mètode FAST és una forma ràpida d\'identificar un possible ictus. Cada minut compta. Si detectes algun símptoma, truca immediatament al 112.',
    'FAST-metoden\nFAST-metoden er en hurtig måde at identificere et muligt slagtilfælde på. Hvert minut tæller. Hvis du opdager et symptom, ring 112 øjeblikkeligt.');
  trad(272, 'herramienta.4.pregunta.F.titulo',   'herramienta', 'F - Face (Cara)', 'F - Face', 'F - Face (Ansikt)', 'F - Face (Visage)', 'F - Face (Cara)', 'F - Face (Ansigt)');
  trad(273, 'herramienta.4.pregunta.F.desc',     'herramienta',
    'Pide a la persona que sonría. ¿Observas asimetría en la cara? ¿Un lado de la boca cae?',
    'Ask the person to smile. Do you see asymmetry in the face? Does one side of the mouth droop?',
    'Be personen smile. Ser du asymmetri i ansiktet? Henger den ene siden av munnen?',
    'Demandez à la personne de sourire. Observez-vous une asymétrie du visage ? Un côté de la bouche s\'affaisse-t-il ?',
    'Demana a la persona que somrigui. Observes asimetria a la cara? Cau un costat de la boca?',
    'Bed personen om at smile. Ser du asymmetri i ansigtet? Hænger den ene mundvig?');
  trad(274, 'herramienta.4.pregunta.F.si',       'herramienta', 'Sí, hay asimetría', 'Yes, there is asymmetry', 'Ja, det er asymmetri', 'Oui, il y a asymétrie', 'Sí, hi ha asimetria', 'Ja, der er asymmetri');
  trad(275, 'herramienta.4.pregunta.F.no',       'herramienta', 'No, es simétrica', 'No, it is symmetrical', 'Nei, det er symmetrisk', 'Non, c\'est symétrique', 'No, és simètrica', 'Nej, den er symmetrisk');
  trad(276, 'herramienta.4.pregunta.A.titulo',   'herramienta', 'A - Arms (Brazos)', 'A - Arms', 'A - Arms (Armer)', 'A - Arms (Bras)', 'A - Arms (Braços)', 'A - Arms (Arme)');
  trad(277, 'herramienta.4.pregunta.A.desc',     'herramienta',
    'Pide que levante ambos brazos con las palmas hacia arriba. ¿Un brazo cae o deriva hacia abajo?',
    'Ask them to raise both arms with palms facing up. Does one arm drop or drift downward?',
    'Be dem løfte begge armene med håndflatene opp. Faller eller driver én arm nedover?',
    'Demandez-lui de lever les deux bras, paumes vers le haut. Un bras tombe-t-il ou dérive-t-il vers le bas ?',
    'Demana que aixequi ambdós braços amb les palmes cap amunt. Un braç cau o deriva cap avall?',
    'Bed dem løfte begge arme med håndfladerne opad. Falder eller driver den ene arm nedad?');
  trad(278, 'herramienta.4.pregunta.A.si',       'herramienta', 'Sí, un brazo cae', 'Yes, one arm drops', 'Ja, en arm faller', 'Oui, un bras tombe', 'Sí, un braç cau', 'Ja, en arm falder');
  trad(279, 'herramienta.4.pregunta.A.no',       'herramienta', 'No, ambos se mantienen', 'No, both stay up', 'Nei, begge holdes oppe', 'Non, les deux se maintiennent', 'No, ambdós es mantenen', 'Nej, begge holdes oppe');
  trad(280, 'herramienta.4.pregunta.S.titulo',   'herramienta', 'S - Speech (Habla)', 'S - Speech', 'S - Speech (Tale)', 'S - Speech (Parole)', 'S - Speech (Parla)', 'S - Speech (Tale)');
  trad(281, 'herramienta.4.pregunta.S.desc',     'herramienta',
    'Pide que repita una frase sencilla. ¿Arrastra las palabras o no puede hablar correctamente?',
    'Ask them to repeat a simple sentence. Do they slur their words or have difficulty speaking?',
    'Be dem gjenta en enkel setning. Snakker de utydelig eller har de vanskeligheter med å snakke?',
    'Demandez-lui de répéter une phrase simple. Traîne-t-il les mots ou a-t-il du mal à parler correctement ?',
    'Demana que repeteixi una frase senzilla. Arrossega les paraules o no pot parlar correctament?',
    'Bed dem gentage en enkel sætning. Slører de ordene eller har svært ved at tale korrekt?');
  trad(282, 'herramienta.4.pregunta.S.si',       'herramienta', 'Sí, habla con dificultad', 'Yes, speech is impaired', 'Ja, talen er svekket', 'Oui, la parole est altérée', 'Sí, parla amb dificultat', 'Ja, talen er forringet');
  trad(283, 'herramienta.4.pregunta.S.no',       'herramienta', 'No, habla con normalidad', 'No, speech is normal', 'Nei, talen er normal', 'Non, la parole est normale', 'No, parla amb normalitat', 'Nej, talen er normal');
  trad(284, 'herramienta.4.pregunta.T.titulo',   'herramienta', 'T - Time (Tiempo)', 'T - Time', 'T - Time (Tid)', 'T - Time (Temps)', 'T - Time (Temps)', 'T - Time (Tid)');
  trad(285, 'herramienta.4.pregunta.T.desc',     'herramienta',
    '¿Los síntomas aparecieron de forma repentina en las últimas horas?',
    'Did the symptoms appear suddenly in the last few hours?',
    'Dukket symptomene opp plutselig de siste timene?',
    'Les symptômes sont-ils apparus soudainement au cours des dernières heures ?',
    'Els símptomes van aparèixer de forma sobtada en les darreres hores?',
    'Opstod symptomerne pludseligt inden for de seneste timer?');
  trad(286, 'herramienta.4.pregunta.T.si',       'herramienta', 'Sí, aparecieron de repente', 'Yes, appeared suddenly', 'Ja, de dukket opp plutselig', 'Oui, sont apparus soudainement', 'Sí, van aparèixer de cop', 'Ja, opstod pludseligt');
  trad(287, 'herramienta.4.pregunta.T.no',       'herramienta', 'No, son síntomas graduales', 'No, symptoms are gradual', 'Nei, symptomene er gradvise', 'Non, ce sont des symptômes progressifs', 'No, són símptomes graduals', 'Nej, symptomerne er gradvise');
  trad(288, 'herramienta.4.resultado.ictus',     'herramienta', 'POSIBLE ICTUS', 'POSSIBLE STROKE', 'MULIG HJERNESLAG', 'AVC POSSIBLE', 'POSSIBLE ICTUS', 'MULIGT SLAGTILFÆLDE');
  trad(289, 'herramienta.4.resultado.no_ictus',  'herramienta', 'Sin síntomas de ictus', 'No stroke symptoms', 'Ingen hjerneslagsymptomer', 'Aucun symptôme d\'AVC', 'Sense símptomes d\'ictus', 'Ingen slagtilfælde-symptomer');
  trad(290, 'herramienta.4.resultado.ictus_desc','herramienta',
    'Se han detectado uno o más síntomas. Llama al 112 INMEDIATAMENTE. El tiempo es crítico.',
    'One or more symptoms have been detected. Call 112 IMMEDIATELY. Time is critical.',
    'Ett eller flere symptomer er oppdaget. Ring 112 UMIDDELBART. Tid er kritisk.',
    'Un ou plusieurs symptômes ont été détectés. Appelez le 112 IMMÉDIATEMENT. Le temps est critique.',
    "S'han detectat un o més símptomes. Truca al 112 IMMEDIATAMENT. El temps és crític.",
    'Et eller flere symptomer er opdaget. Ring 112 ØJEBLIKKELIGT. Tid er kritisk.');
  trad(291, 'herramienta.4.resultado.no_ictus_desc','herramienta',
    'No se han detectado síntomas de ictus en este momento. Si tienes dudas, consulta con un médico.',
    'No stroke symptoms detected at this time. If in doubt, consult a doctor.',
    'Ingen hjerneslagsymptomer oppdaget akkurat nå. Kontakt lege ved tvil.',
    "Aucun symptôme d'AVC détecté pour le moment. En cas de doute, consultez un médecin.",
    "No s'han detectat símptomes d'ictus en aquest moment. Si tens dubtes, consulta un metge.",
    'Ingen slagtilfælde-symptomer opdaget på nuværende tidspunkt. Konsulter en læge ved tvivl.');

  // H5 Calculadora Quemaduras
  trad(292, 'herramienta.5.aviso_titulo',        'herramienta', 'Regla de los 9', 'Rule of 9s', 'Ni-regelen', 'Règle des 9', 'Regla dels 9', '9-reglen');
  trad(293, 'herramienta.5.aviso_desc',          'herramienta',
    'Esta calculadora usa la "Regla de los 9" para calcular el porcentaje de superficie corporal quemada en adultos.\n\nRegla de la palma: La palma de la mano de la víctima (sin el dedo pulgar) representa aproximadamente el 1% de su superficie corporal.',
    'This calculator uses the "Rule of 9s" to estimate the percentage of burned body surface area in adults.\n\nPalm rule: The victim\'s palm (excluding the thumb) represents approximately 1% of their body surface.',
    'Denne kalkulatoren bruker "Ni-regelen" for å beregne prosentandelen av forbrent kroppsoverflate hos voksne.\n\nHåndflateregel: Offerets håndflate (uten tommelen) utgjør omtrent 1% av kroppsoverflaten.',
    'Cette calculatrice utilise la "Règle des 9" pour estimer le pourcentage de surface corporelle brûlée chez les adultes.\n\nRègle de la paume : La paume de la victime (sans le pouce) représente environ 1% de sa surface corporelle.',
    'Aquesta calculadora usa la "Regla dels 9" per calcular el percentatge de superfície corporal cremada en adults.\n\nRegla del palmell: El palmell de la mà de la víctima (sense el polze) representa aproximadament l\'1% de la seva superfície corporal.',
    'Denne lommeregner bruger "9-reglen" til at beregne procentdelen af forbrændt kropsoverflade hos voksne.\n\nHåndfladeregel: Offerets håndflate (uden tommelfingeren) udgør ca. 1% af kropsoverfladen.');
  trad(294, 'herramienta.5.selecciona',          'herramienta', 'Selecciona las áreas quemadas', 'Select burned areas', 'Velg brente områder', 'Sélectionnez les zones brûlées', 'Selecciona les àrees cremades', 'Vælg forbrændte områder');
  trad(295, 'herramienta.5.area.cabeza_cuello',  'herramienta', 'Cabeza y cuello', 'Head and neck', 'Hode og nakke', 'Tête et cou', 'Cap i coll', 'Hoved og hals');
  trad(296, 'herramienta.5.area.pecho',          'herramienta', 'Pecho (frontal)', 'Chest (front)', 'Bryst (frontal)', 'Poitrine (frontale)', 'Pit (frontal)', 'Bryst (frontal)');
  trad(297, 'herramienta.5.area.abdomen',        'herramienta', 'Abdomen (frontal)', 'Abdomen (front)', 'Mage (frontal)', 'Abdomen (frontal)', 'Abdomen (frontal)', 'Mave (frontal)');
  trad(298, 'herramienta.5.area.espalda_superior','herramienta', 'Espalda superior', 'Upper back', 'Øvre rygg', 'Dos supérieur', 'Esquena superior', 'Øvre ryg');
  trad(299, 'herramienta.5.area.espalda_inferior','herramienta', 'Espalda inferior', 'Lower back', 'Nedre rygg', 'Bas du dos', 'Esquena inferior', 'Nedre ryg');
  trad(300, 'herramienta.5.area.brazo_der',      'herramienta', 'Brazo derecho', 'Right arm', 'Høyre arm', 'Bras droit', 'Braç dret', 'Højre arm');
  trad(301, 'herramienta.5.area.brazo_izq',      'herramienta', 'Brazo izquierdo', 'Left arm', 'Venstre arm', 'Bras gauche', 'Braç esquerre', 'Venstre arm');
  trad(302, 'herramienta.5.area.pierna_der_f',   'herramienta', 'Pierna derecha (frontal)', 'Right leg (front)', 'Høyre bein (frontal)', 'Jambe droite (frontale)', 'Cama dreta (frontal)', 'Højre ben (frontal)');
  trad(303, 'herramienta.5.area.pierna_der_p',   'herramienta', 'Pierna derecha (posterior)', 'Right leg (back)', 'Høyre bein (bakside)', 'Jambe droite (postérieure)', 'Cama dreta (posterior)', 'Højre ben (bagside)');
  trad(304, 'herramienta.5.area.pierna_izq_f',   'herramienta', 'Pierna izquierda (frontal)', 'Left leg (front)', 'Venstre bein (frontal)', 'Jambe gauche (frontale)', 'Cama esquerra (frontal)', 'Venstre ben (frontal)');
  trad(305, 'herramienta.5.area.pierna_izq_p',   'herramienta', 'Pierna izquierda (posterior)', 'Left leg (back)', 'Venstre bein (bakside)', 'Jambe gauche (postérieure)', 'Cama esquerra (posterior)', 'Venstre ben (bagside)');
  trad(306, 'herramienta.5.area.genitales',      'herramienta', 'Genitales', 'Genitals', 'Kjønnsorgan', 'Organes génitaux', 'Genitals', 'Kønsdele');
  trad(307, 'herramienta.5.metodo_palma_titulo', 'herramienta', 'Método de la palma', 'Palm method', 'Håndflatermetoden', 'Méthode de la paume', 'Mètode del palmell', 'Håndflademetoden');
  trad(308, 'herramienta.5.metodo_palma_desc',   'herramienta',
    'Para áreas pequeñas o irregulares, cuenta cuántas veces cabe la palma de la mano de la víctima sobre la quemadura. Cada palma = 1%.',
    'For small or irregular areas, count how many times the victim\'s palm fits over the burn. Each palm = 1%.',
    'For små eller uregelmessige områder, tell hvor mange ganger offerets håndflate passer over forbrenningen. Hver håndflate = 1%.',
    'Pour les petites zones ou irrégulières, comptez combien de fois la paume de la victime couvre la brûlure. Chaque paume = 1%.',
    'Per a àrees petites o irregulars, compta quantes vegades cap el palmell de la mà de la víctima sobre la cremada. Cada palmell = 1%.',
    'For små eller uregelmæssige områder, tæl hvor mange gange offerets håndflate passer over forbrændingen. Hver håndflate = 1%.');
  trad(309, 'herramienta.5.num_palmas',          'herramienta', 'Número de palmas:', 'Number of palms:', 'Antall håndflater:', 'Nombre de paumes :', 'Nombre de palmells:', 'Antal håndflader:');
  trad(310, 'herramienta.5.resultado',           'herramienta', 'Resultado', 'Result', 'Resultat', 'Résultat', 'Resultat', 'Resultat');
  trad(311, 'herramienta.5.severidad',           'herramienta', 'Severidad estimada:', 'Estimated severity:', 'Estimert alvorlighetsgrad:', 'Gravité estimée :', 'Gravetat estimada:', 'Estimeret sværhedsgrad:');
  trad(312, 'herramienta.5.leve',                'herramienta', 'Leve', 'Mild', 'Mild', 'Légère', 'Lleu', 'Let');
  trad(313, 'herramienta.5.moderada',            'herramienta', 'Moderada', 'Moderate', 'Moderat', 'Modérée', 'Moderada', 'Moderat');
  trad(314, 'herramienta.5.grave',               'herramienta', 'Grave', 'Severe', 'Alvorlig', 'Grave', 'Greu', 'Alvorlig');

  // H6 Registro Exploración
  trad(315, 'herramienta.6.aviso',               'herramienta',
    '¿Qué es la exploración secundaria?\nEs una evaluación detallada que se realiza después de asegurarse de que no hay problemas vitales inmediatos. Registra todo lo que observes y lo que la víctima comunique. Esta información es crucial para el personal sanitario.',
    'What is secondary assessment?\nIt is a detailed evaluation performed after ensuring there are no immediate life-threatening problems. Record everything you observe and what the victim communicates. This information is crucial for medical personnel.',
    'Hva er sekundærvurdering?\nDet er en detaljert evaluering som utføres etter å ha sørget for at det ikke er umiddelbare livstruende problemer. Registrer alt du observerer og hva offeret kommuniserer. Denne informasjonen er avgjørende for helsepersonell.',
    'Qu\'est-ce que le bilan secondaire ?\nC\'est une évaluation détaillée effectuée après s\'être assuré qu\'il n\'y a pas de problèmes vitaux immédiats. Enregistrez tout ce que vous observez et ce que la victime communique. Ces informations sont cruciales pour le personnel médical.',
    'Què és l\'exploració secundària?\nÉs una avaluació detallada que es realitza després d\'assegurar-se que no hi ha problemes vitals immediats. Registra tot el que observes i el que la víctima comunica. Aquesta informació és crucial per al personal sanitari.',
    'Hvad er sekundær vurdering?\nDet er en detaljeret evaluering udført efter at sikre, at der ikke er umiddelbare livstruende problemer. Registrer alt du observerer og hvad offeret kommunikerer. Disse oplysninger er afgørende for sundhedspersonalet.');
  trad(316, 'herramienta.6.selecciona_cat',      'herramienta', 'Selecciona categoría', 'Select category', 'Velg kategori', 'Sélectionnez une catégorie', 'Selecciona categoria', 'Vælg kategori');
  trad(317, 'herramienta.6.cat.signos_visibles', 'herramienta', 'Signos visibles', 'Visible signs', 'Synlige tegn', 'Signes visibles', 'Signes visibles', 'Synlige tegn');
  trad(318, 'herramienta.6.cat.signos_visibles_desc','herramienta', 'Lo que ves (color, textura, hinchazón)', 'What you see (color, texture, swelling)', 'Hva du ser (farge, tekstur, hevelse)', 'Ce que vous voyez (couleur, texture, gonflement)', 'El que veus (color, textura, inflor)', 'Hvad du ser (farve, tekstur, hævelse)');
  trad(319, 'herramienta.6.cat.sintomas',        'herramienta', 'Síntomas', 'Symptoms', 'Symptomer', 'Symptômes', 'Símptomes', 'Symptomer');
  trad(320, 'herramienta.6.cat.sintomas_desc',   'herramienta', 'Lo que la víctima describe', 'What the victim describes', 'Hva offeret beskriver', 'Ce que la victime décrit', 'El que la víctima descriu', 'Hvad offeret beskriver');
  trad(321, 'herramienta.6.cat.signos_vitales',  'herramienta', 'Signos vitales', 'Vital signs', 'Vitale tegn', 'Signes vitaux', 'Signes vitals', 'Vitale tegn');
  trad(322, 'herramienta.6.cat.signos_vitales_desc','herramienta', 'Pulso, respiración, temperatura', 'Pulse, breathing, temperature', 'Puls, pust, temperatur', 'Pouls, respiration, température', 'Pols, respiració, temperatura', 'Puls, vejrtrækning, temperatur');
  trad(323, 'herramienta.6.cat.lesiones',        'herramienta', 'Lesiones', 'Injuries', 'Skader', 'Blessures', 'Lesions', 'Skader');
  trad(324, 'herramienta.6.cat.lesiones_desc',   'herramienta', 'Heridas, fracturas, quemaduras', 'Wounds, fractures, burns', 'Sår, brudd, forbrenninger', 'Plaies, fractures, brûlures', 'Ferides, fractures, cremades', 'Sår, frakturer, forbrændinger');
  trad(325, 'herramienta.6.cat.historial',       'herramienta', 'Historial médico', 'Medical history', 'Sykehistorie', 'Antécédents médicaux', 'Historial mèdic', 'Sygehistorie');
  trad(326, 'herramienta.6.cat.historial_desc',  'herramienta', 'Alergias, medicación, enfermedades previas', 'Allergies, medication, previous conditions', 'Allergier, medisiner, tidligere sykdommer', 'Allergies, médicaments, maladies antérieures', 'Al·lèrgies, medicació, malalties prèvies', 'Allergier, medicin, tidligere sygdomme');
  trad(327, 'herramienta.6.cat.otros',           'herramienta', 'Otros datos', 'Other data', 'Andre data', 'Autres données', 'Altres dades', 'Andre data');
  trad(328, 'herramienta.6.cat.otros_desc',      'herramienta', 'Información adicional', 'Additional information', 'Tilleggsinformasjon', 'Informations supplémentaires', 'Informació addicional', 'Yderligere oplysninger');
  trad(329, 'herramienta.6.nueva_obs',           'herramienta', 'Nueva observación', 'New observation', 'Ny observasjon', 'Nouvelle observation', 'Nova observació', 'Ny observation');
  trad(330, 'herramienta.6.obs_hint',            'herramienta', 'Escribe aquí tu observación...', 'Write your observation here...', 'Skriv din observasjon her...', 'Écrivez votre observation ici...', 'Escriu aquí la teva observació...', 'Skriv din observation her...');
  trad(331, 'herramienta.6.guardar_obs',         'herramienta', 'Guardar observación', 'Save observation', 'Lagre observasjon', 'Enregistrer l\'observation', 'Desar observació', 'Gem observation');
  trad(332, 'herramienta.6.sin_obs',             'herramienta',
    'No hay observaciones registradas aún.\nComienza añadiendo información sobre la víctima.',
    'No observations recorded yet.\nStart by adding information about the victim.',
    'Ingen observasjoner registrert ennå.\nStart med å legge til informasjon om offeret.',
    'Aucune observation enregistrée pour le moment.\nCommencez par ajouter des informations sur la victime.',
    'No hi ha observacions registrades encara.\nComença afegint informació sobre la víctima.',
    'Ingen observationer registreret endnu.\nBegynd med at tilføje oplysninger om offeret.');
  trad(333, 'herramienta.6.obs_registradas',     'herramienta', 'Observaciones registradas:', 'Recorded observations:', 'Registrerte observasjoner:', 'Observations enregistrées :', 'Observacions registrades:', 'Registrerede observationer:');
  trad(334, 'herramienta.6.ver_resumen',         'herramienta', 'Ver resumen', 'View summary', 'Se sammendrag', 'Voir le résumé', 'Veure resum', 'Se opsummering');
  trad(335, 'herramienta.6.resumen_titulo',      'herramienta', 'Resumen del registro', 'Record summary', 'Sammendrag av registeret', 'Résumé du registre', 'Resum del registre', 'Registreringsoversigt');
  trad(336, 'herramienta.6.resumen_copiado',     'herramienta', 'Registro copiado al portapapeles', 'Record copied to clipboard', 'Registeret er kopiert til utklippstavlen', 'Registre copié dans le presse-papiers', 'Registre copiat al porta-retalls', 'Registrering kopieret til udklipsholder');
  trad(337, 'herramienta.6.copiar',              'herramienta', 'Copiar', 'Copy', 'Kopier', 'Copier', 'Copiar', 'Kopiér');
  trad(338, 'herramienta.6.cerrar',              'herramienta', 'Cerrar', 'Close', 'Lukk', 'Fermer', 'Tancar', 'Luk');
  trad(339, 'herramienta.6.borrar_registro',     'herramienta', 'Borrar registro', 'Delete record', 'Slett registeret', 'Supprimer le registre', 'Esborrar registre', 'Slet registrering');
  trad(340, 'herramienta.6.borrar_confirm',      'herramienta',
    '¿Borrar todas las observaciones? Esta acción no se puede deshacer.',
    'Delete all observations? This action cannot be undone.',
    'Slette alle observasjoner? Denne handlingen kan ikke angres.',
    'Supprimer toutes les observations ? Cette action est irréversible.',
    'Esborrar totes les observacions? Aquesta acció no es pot desfer.',
    'Slet alle observationer? Denne handling kan ikke fortrydes.');
  trad(341, 'herramienta.6.borrar_todo',         'herramienta', 'Borrar todo', 'Delete all', 'Slett alt', 'Tout supprimer', 'Esborrar tot', 'Slet alt');

  // H7 Ficha Médica
  trad(342, 'herramienta.7.aviso_titulo',        'herramienta', 'Información de emergencia', 'Emergency information', 'Nødinformasjon', 'Informations d\'urgence', 'Informació d\'emergència', 'Nødinformation');
  trad(343, 'herramienta.7.aviso_desc1',         'herramienta',
    'Esta información se guarda en tu dispositivo y puede ser crucial cuando lleguen los servicios de emergencia.',
    'This information is saved on your device and can be crucial when emergency services arrive.',
    'Denne informasjonen lagres på enheten din og kan være avgjørende når nødetatene ankommer.',
    'Ces informations sont enregistrées sur votre appareil et peuvent être cruciales lorsque les services d\'urgence arrivent.',
    'Aquesta informació es guarda al teu dispositiu i pot ser crucial quan arribin els serveis d\'emergència.',
    'Disse oplysninger gemmes på din enhed og kan være afgørende, når nødetaterne ankommer.');
  trad(344, 'herramienta.7.aviso_desc2',         'herramienta',
    '⚠ Esta aplicación NO es un almacenamiento médico oficial.',
    '⚠ This application is NOT an official medical storage.',
    '⚠ Denne appen er IKKE en offisiell medisinsk lagringsplass.',
    '⚠ Cette application N\'est PAS un stockage médical officiel.',
    '⚠ Aquesta aplicació NO és un emmagatzematge mèdic oficial.',
    '⚠ Denne applikation er IKKE en officiel medicinsk lagring.');
  trad(345, 'herramienta.7.sec_datos',           'herramienta', 'Datos personales', 'Personal data', 'Personopplysninger', 'Données personnelles', 'Dades personals', 'Personoplysninger');
  trad(346, 'herramienta.7.campo_nombre',        'herramienta', 'Nombre completo', 'Full name', 'Fullt navn', 'Nom complet', 'Nom complet', 'Fuldt navn');
  trad(347, 'herramienta.7.campo_grupo',         'herramienta', 'Grupo sanguíneo', 'Blood type', 'Blodtype', 'Groupe sanguin', 'Grup sanguini', 'Blodtype');
  trad(348, 'herramienta.7.sec_medica',          'herramienta', 'Información médica crítica', 'Critical medical information', 'Kritisk medisinsk informasjon', 'Informations médicales critiques', 'Informació mèdica crítica', 'Kritiske medicinske oplysninger');
  trad(349, 'herramienta.7.campo_alergias',      'herramienta', 'Alergias', 'Allergies', 'Allergier', 'Allergies', 'Al·lèrgies', 'Allergier');
  trad(350, 'herramienta.7.campo_medicacion',    'herramienta', 'Medicación habitual', 'Regular medication', 'Fast medisinering', 'Médicaments habituels', 'Medicació habitual', 'Fast medicin');
  trad(351, 'herramienta.7.campo_enfermedades',  'herramienta', 'Enfermedades / Condiciones médicas', 'Diseases / Medical conditions', 'Sykdommer / Medisinske tilstander', 'Maladies / Conditions médicales', 'Malalties / Condicions mèdiques', 'Sygdomme / Medicinske tilstande');
  trad(352, 'herramienta.7.campo_tetanos',       'herramienta', 'Última vacuna del tétanos', 'Last tetanus vaccine', 'Siste stivkrampevaksine', 'Dernier vaccin antitétanique', 'Última vacuna del tètanus', 'Seneste stivkrampevaccine');
  trad(353, 'herramienta.7.campo_donante',       'herramienta', 'Donante de órganos', 'Organ donor', 'Organdonor', 'Donneur d\'organes', 'Donant d\'òrgans', 'Organdonor');
  trad(354, 'herramienta.7.campo_seguro',        'herramienta', 'Seguro médico / Mutua', 'Health insurance', 'Helseforsikring', 'Assurance maladie', 'Assegurança mèdica', 'Sygeforsikring');
  trad(355, 'herramienta.7.sec_contactos',       'herramienta', 'Contactos de emergencia', 'Emergency contacts', 'Nødkontakter', 'Contacts d\'urgence', 'Contactes d\'emergència', 'Nødkontakter');
  trad(356, 'herramienta.7.contacto1',           'herramienta', 'Contacto 1', 'Contact 1', 'Kontakt 1', 'Contact 1', 'Contacte 1', 'Kontakt 1');
  trad(357, 'herramienta.7.contacto2',           'herramienta', 'Contacto 2', 'Contact 2', 'Kontakt 2', 'Contact 2', 'Contacte 2', 'Kontakt 2');
  trad(358, 'herramienta.7.campo_nombre_c',      'herramienta', 'Nombre', 'Name', 'Navn', 'Nom', 'Nom', 'Navn');
  trad(359, 'herramienta.7.campo_tel',           'herramienta', 'Teléfono', 'Phone', 'Telefon', 'Téléphone', 'Telèfon', 'Telefon');
  trad(360, 'herramienta.7.guardar_ficha',       'herramienta', 'Guardar ficha médica', 'Save medical card', 'Lagre medisinkort', 'Enregistrer la fiche médicale', 'Desar fitxa mèdica', 'Gem medicinkort');
  trad(361, 'herramienta.7.aviso_privacidad',    'herramienta',
    'ℹ Toda la información se guarda únicamente en tu dispositivo. No se envía a ningún servidor externo.',
    'ℹ All information is stored only on your device. It is not sent to any external server.',
    'ℹ All informasjon lagres kun på enheten din. Den sendes ikke til noen ekstern server.',
    'ℹ Toutes les informations sont stockées uniquement sur votre appareil. Elles ne sont envoyées à aucun serveur externe.',
    'ℹ Tota la informació es guarda únicament al teu dispositiu. No s\'envia a cap servidor extern.',
    'ℹ Alle oplysninger gemmes kun på din enhed. De sendes ikke til nogen ekstern server.');
  trad(362, 'herramienta.7.guardada',            'herramienta', 'Ficha guardada correctamente', 'Medical card saved successfully', 'Medisinkort lagret', 'Fiche médicale enregistrée avec succès', 'Fitxa mèdica desada correctament', 'Medicinkort gemt');

  // H8 Maniobra Heimlich
  trad(363, 'herramienta.8.alerta',              'herramienta',
    'Si NO puede hablar, toser con fuerza ni respirar: ACTÚA AHORA.\n\nSi puede toser, anímale a seguir tosiendo por sí mismo.',
    'If they CANNOT speak, cough forcefully or breathe: ACT NOW.\n\nIf they can cough, encourage them to keep coughing on their own.',
    'Hvis de IKKE kan snakke, hoste kraftig eller puste: HANDLE NÅ.\n\nHvis de kan hoste, oppmuntre dem til å fortsette å hoste selv.',
    'S\'ils NE peuvent PAS parler, tousser fort ni respirer : AGISSEZ MAINTENANT.\n\nS\'ils peuvent tousser, encouragez-les à continuer à tousser seuls.',
    'Si NO pot parlar, tossir amb força ni respirar: ACTUA ARA.\n\nSi pot tossir, anima\'l a continuar tossint per si sol.',
    'Hvis de IKKE kan tale, hoste kraftigt eller trække vejret: HANDL NU.\n\nHvis de kan hoste, opfordr dem til at fortsætte med at hoste selv.');
  trad(364, 'herramienta.8.adulto_titulo',       'herramienta', 'Adulto o niño consciente (>1 año)', 'Conscious adult or child (>1 year)', 'Bevisst voksen eller barn (>1 år)', 'Adulte ou enfant conscient (>1 an)', 'Adult o nen conscient (>1 any)', 'Bevidst voksen eller barn (>1 år)');
  trad(365, 'herramienta.8.adulto_pasos',        'herramienta',
    'Colócate detrás de la persona y ponla levemente inclinada hacia adelante.\nPon un pie adelante para tener mayor estabilidad.\nCierra un puño y colócalo por encima del ombligo y por debajo del esternón, con el pulgar hacia dentro.\nCon la otra mano, agarra el puño con fuerza.\nRealiza empujes bruscos hacia adentro y hacia arriba.\nRepite hasta que el objeto salga o la persona pierda el conocimiento.',
    'Stand behind the person and tilt them slightly forward.\nPut one foot forward for greater stability.\nMake a fist and place it above the navel and below the sternum, thumb facing inward.\nWith the other hand, grasp the fist firmly.\nPerform quick, sharp thrusts inward and upward.\nRepeat until the object comes out or the person loses consciousness.',
    'Still deg bak personen og lut dem litt fremover.\nSett en fot frem for større stabilitet.\nLag en neve og plasser den over navlen og under brystbenet, med tommelen innover.\nMed den andre hånden, grip neven fast.\nUtfør raske, skarpe støt innover og oppover.\nRepeter til gjenstanden kommer ut eller personen mister bevisstheten.',
    'Placez-vous derrière la personne et inclinez-la légèrement en avant.\nAvancez un pied pour une plus grande stabilité.\nFermez le poing et placez-le au-dessus du nombril et en dessous du sternum, le pouce vers l\'intérieur.\nDe l\'autre main, saisissez le poing fermement.\nEffectuez des poussées brusques vers l\'intérieur et vers le haut.\nRépétez jusqu\'à ce que l\'objet sorte ou que la personne perde connaissance.',
    'Col·loca\'t darrere la persona i inclina-la lleugerament cap endavant.\nPosa un peu endavant per tenir major estabilitat.\nTanca el puny i col·loca\'l per sobre del melic i per sota de l\'estern, amb el polze cap endins.\nAmb l\'altra mà, agafa el puny amb força.\nFes empentes brusques cap endins i cap amunt.\nRepeteix fins que l\'objecte surti o la persona perdi el coneixement.',
    'Stil dig bag personen og vip dem lidt fremad.\nSæt en fod frem for større stabilitet.\nLav en knytnæve og placer den over navlen og under brystbenet, med tommelfingeren indad.\nMed den anden hånd, grib knytnæven fast.\nUdfør hurtige, skarpe støt indad og opad.\nGentagene gange, indtil genstanden kommer ud, eller personen besvimer.');
  trad(366, 'herramienta.8.bebe_titulo',         'herramienta', 'Bebé (menor de 1 año)', 'Baby (under 1 year)', 'Spedbarn (under 1 år)', 'Bébé (moins d\'1 an)', 'Nadó (menor d\'1 any)', 'Baby (under 1 år)');
  trad(367, 'herramienta.8.bebe_pasos',          'herramienta',
    'Sujeta al bebé boca abajo sobre tu antebrazo, con la cabeza más baja que el cuerpo.\nDa 5 palmadas firmes entre los omóplatos con el talón de la mano.\nGíralo boca arriba apoyando la cabeza en todo momento.\nDa 5 compresiones torácicas con 2 dedos en el centro del pecho, justo bajo la línea de los pezones.\nAlterna 5 palmadas en la espalda y 5 compresiones en el pecho.\nRepite hasta que el objeto salga o el bebé pierda el conocimiento.',
    'Hold the baby face down on your forearm, with the head lower than the body.\nGive 5 firm back blows between the shoulder blades with the heel of your hand.\nTurn them face up, supporting the head at all times.\nGive 5 chest compressions with 2 fingers in the center of the chest, just below the nipple line.\nAlternate 5 back blows and 5 chest compressions.\nRepeat until the object comes out or the baby loses consciousness.',
    'Hold babyen ansiktet ned på underarmen din, med hodet lavere enn kroppen.\nGi 5 faste slag mellom skulderbladene med håndbaken.\nSnu dem opp ansiktet, støtt hodet hele tiden.\nGi 5 brystkompresjon med 2 fingre midt på brystet, rett under brystvortelinja.\nVeksle 5 slag på ryggen og 5 brystkompresjoner.\nRepeter til gjenstanden kommer ut eller babyen mister bevisstheten.',
    'Tenez le bébé face vers le bas sur votre avant-bras, la tête plus basse que le corps.\nDonnez 5 tapes fermes entre les omoplates avec le talon de la main.\nRetournez-le face vers le haut en soutenant la tête en tout temps.\nDonnez 5 compressions thoraciques avec 2 doigts au centre de la poitrine, juste sous la ligne des mamelons.\nAlternez 5 tapes dans le dos et 5 compressions thoraciques.\nRépétez jusqu\'à ce que l\'objet sorte ou que le bébé perde connaissance.',
    'Aguanta el nadó cara avall sobre el teu avantbraç, amb el cap més baix que el cos.\nDóna 5 palmades fermes entre els omòplats amb el taló de la mà.\nGira\'l cara amunt donant suport al cap en tot moment.\nDóna 5 compressions toràciques amb 2 dits al centre del pit, just per sota de la línia dels mugrons.\nAlterna 5 palmades a l\'esquena i 5 compressions al pit.\nRepeteix fins que l\'objecte surti o el nadó perdi el coneixement.',
    'Hold babyen ansigt nedad på din underarm, med hovedet lavere end kroppen.\nGiv 5 faste klap mellem skulderbladene med håndroden.\nVend dem ansigt opad, støt hovedet hele tiden.\nGiv 5 brystkompressioner med 2 fingre midt på brystet, lige under brystvortelinjen.\nSkift mellem 5 slag på ryggen og 5 brystkompressioner.\nGentagene gange, indtil genstanden kommer ud, eller babyen besvimer.');
  trad(368, 'herramienta.8.bebe_advertencia',    'herramienta',
    'NO hagas compresiones abdominales (Heimlich) en bebés menores de 1 año.',
    'DO NOT perform abdominal compressions (Heimlich) on babies under 1 year old.',
    'IKKE gjør magekompresjoner (Heimlich) på spedbarn under 1 år.',
    'NE FAITES PAS de compressions abdominales (Heimlich) sur les bébés de moins de 1 an.',
    'NO facis compressions abdominals (Heimlich) en nadons menors d\'1 any.',
    'LAV IKKE mavekompressioner (Heimlich) på babyer under 1 år.');
  trad(369, 'herramienta.8.inconsciente_titulo', 'herramienta', 'Si pierde el conocimiento', 'If unconscious', 'Hvis bevisstløs', 'En cas de perte de connaissance', 'Si perd el coneixement', 'Hvis bevidstløs');
  trad(370, 'herramienta.8.inconsciente_pasos',  'herramienta',
    'Llama al 112 inmediatamente.\nTúmbala en el suelo con cuidado boca arriba.\nInicia la RCP: 30 compresiones torácicas + 2 ventilaciones.\nAntes de cada ventilación, mira en la boca y extrae el objeto solo si lo ves claramente.\nContinúa hasta que llegue la ayuda o la persona recupere el conocimiento.',
    'Call 112 immediately.\nLay them carefully on the floor face up.\nBegin CPR: 30 chest compressions + 2 breaths.\nBefore each breath, look in the mouth and remove the object only if you can clearly see it.\nContinue until help arrives or the person regains consciousness.',
    'Ring 112 umiddelbart.\nLegg dem forsiktig på gulvet med ansiktet opp.\nStart HLR: 30 brystkompresjoner + 2 innblåsinger.\nFør hver innblåsing, se i munnen og fjern gjenstanden bare hvis du tydelig ser den.\nFortsett til hjelp ankommer eller personen gjenvinner bevisstheten.',
    'Appelez le 112 immédiatement.\nAllongez-les délicatement au sol sur le dos.\nCommencez la RCP : 30 compressions thoraciques + 2 ventilations.\nAvant chaque ventilation, regardez dans la bouche et retirez l\'objet seulement si vous le voyez clairement.\nContinuez jusqu\'à l\'arrivée des secours ou la reprise de connaissance.',
    'Truca al 112 immediatament.\nTomba\'l amb cura al terra boca amunt.\nInicia la RCP: 30 compressions toràciques + 2 ventilacions.\nAbans de cada ventilació, mira a la boca i extreu l\'objecte només si el veus clarament.\nContinua fins que arribi l\'ajuda o la persona recuperi el coneixement.',
    'Ring 112 øjeblikkeligt.\nLæg dem forsigtigt på gulvet med ansigtet opad.\nPåbegynd HLR: 30 brystkompressioner + 2 indblæsninger.\nFør hver indblæsning, kig i munden og fjern genstanden kun hvis du tydeligt kan se den.\nFortsæt, indtil hjælp ankommer eller personen genvinder bevidstheden.');
  trad(371, 'herramienta.8.auto_titulo',         'herramienta', 'Si estás solo/a (automaniobra)', 'If alone (self-maneuver)', 'Hvis du er alene (selvmanøver)', 'Si vous êtes seul(e) (auto-manœuvre)', "Si estàs sol/a (automaniobra)", 'Hvis du er alene (selvmanøvre)');
  trad(372, 'herramienta.8.auto_pasos',          'herramienta',
    'Cierra un puño por encima del ombligo y empuja con fuerza hacia adentro y hacia arriba.\nO inclínate sobre el respaldo de una silla o el borde de una mesa y ejerce presión brusca sobre el abdomen.\nRepite con fuerza hasta que el objeto salga.',
    'Make a fist above the navel and thrust forcefully inward and upward.\nOr lean over the back of a chair or the edge of a table and apply sharp pressure to the abdomen.\nRepeat forcefully until the object comes out.',
    'Lag en neve over navlen og trykk kraftig innover og oppover.\nEller lut deg over ryggen på en stol eller kanten av et bord og utøv skarp trykk mot magen.\nRepeter kraftig til gjenstanden kommer ut.',
    'Fermez le poing au-dessus du nombril et poussez avec force vers l\'intérieur et vers le haut.\nOu penchez-vous sur le dossier d\'une chaise ou le bord d\'une table et exercez une pression brusque sur l\'abdomen.\nRépétez avec force jusqu\'à ce que l\'objet sorte.',
    'Tanca el puny per sobre del melic i empeny amb força cap endins i cap amunt.\nO inclina\'t sobre el respatller d\'una cadira o la vora d\'una taula i exerceix pressió sobtada sobre l\'abdomen.\nRepeteix amb força fins que l\'objecte surti.',
    'Lav en knytnæve over navlen og tryk kraftigt indad og opad.\nEller læn dig over ryggen på en stol eller kanten af et bord og udøv et skarpt tryk på maven.\nGentag kraftigt, indtil genstanden kommer ud.');

  // H9 Guía Quemaduras
  trad(373, 'herramienta.9.aviso',               'herramienta',
    'Ante cualquier quemadura, lo primero es alejar a la persona de la fuente de calor y eliminar la causa (apagar llamas, retirar ropa no pegada, limpiar producto químico).',
    'For any burn, the first step is to move the person away from the heat source and eliminate the cause (extinguish flames, remove non-stuck clothing, rinse off chemicals).',
    'Ved enhver forbrenning er det første å flytte personen bort fra varmekilden og eliminere årsaken (slukke flammer, fjerne klær som ikke sitter fast, skylle av kjemikalier).',
    'Pour toute brûlure, la première étape est d\'éloigner la personne de la source de chaleur et d\'éliminer la cause (éteindre les flammes, retirer les vêtements non collés, rincer les produits chimiques).',
    'Davant qualsevol cremada, el primer és allunyar la persona de la font de calor i eliminar la causa (apagar flames, treure roba no enganxada, netejar producte químic).',
    'Ved enhver forbrænding er det første at flytte personen væk fra varmekilden og fjerne årsagen (slukke flammer, fjerne ikke-fastsiddende tøj, skylle kemikalier af).');
  trad(374, 'herramienta.9.identifica',          'herramienta', 'Identifica el grado', 'Identify the degree', 'Identifiser graden', 'Identifiez le degré', 'Identifica el grau', 'Identificér graden');
  trad(375, 'herramienta.9.grado1_titulo',       'herramienta', '1.er grado — Superficial', '1st degree — Superficial', '1. grad — Overfladisk', '1er degré — Superficiel', '1r grau — Superficial', '1. grad — Overfladisk');
  trad(376, 'herramienta.9.grado1_sintomas',     'herramienta',
    'Piel enrojecida, seca y dolorosa\nSin ampollas\nSolo afecta la capa superficial de la piel\nEjemplo: quemadura solar leve, contacto breve con objeto caliente',
    'Red, dry and painful skin\nNo blisters\nOnly affects the superficial skin layer\nExample: mild sunburn, brief contact with a hot object',
    'Rød, tørr og smertefull hud\nIngen blemmer\nPåvirker kun det overfladiske hudlaget\nEksempel: lett solforbrenning, kort kontakt med varm gjenstand',
    'Peau rouge, sèche et douloureuse\nPas d\'ampoules\nN\'affecte que la couche superficielle de la peau\nExemple : coup de soleil léger, contact bref avec un objet chaud',
    'Pell vermella, seca i dolorosa\nSense butllofes\nNomés afecta la capa superficial de la pell\nExemple: cremada solar lleu, contacte breu amb objecte calent',
    'Rød, tør og smertefuld hud\nIngen blærer\nPåvirker kun det overfladiske hudlag\nEksempel: let solskoldning, kort kontakt med en varm genstand');
  trad(377, 'herramienta.9.grado1_tratamiento',  'herramienta',
    'Aplica agua fría corriente durante 10–20 minutos\nNo uses hielo, mantequilla ni cremas\nCubre con tela limpia y no adherente\nToma un analgésico si el dolor es intenso\nBusca atención médica si la zona es grande o no mejora en 5 días',
    'Apply cool running water for 10–20 minutes\nDo not use ice, butter or creams\nCover with clean, non-adherent cloth\nTake a painkiller if pain is severe\nSeek medical attention if the area is large or does not improve in 5 days',
    'Påfør kjølig rennende vann i 10–20 minutter\nIkke bruk is, smør eller kremer\nDekk til med rent, ikke-klebende stoff\nTa et smertestillende middel hvis smerten er intens\nOppsøk legehjelp hvis området er stort eller ikke bedres i løpet av 5 dager',
    'Appliquez de l\'eau froide courante pendant 10–20 minutes\nN\'utilisez pas de glace, de beurre ni de crèmes\nCouvrez avec un tissu propre et non adhérent\nPrenez un analgésique si la douleur est intense\nConsultez un médecin si la zone est grande ou ne s\'améliore pas en 5 jours',
    'Aplica aigua freda corrent durant 10–20 minuts\nNo facis servir gel, mantequilla ni cremes\nCobreix amb tela neta i no adherent\nPrén un analgèsic si el dolor és intens\nBusca atenció mèdica si la zona és gran o no millora en 5 dies',
    'Påfør køligt rindende vand i 10–20 minutter\nBrug ikke is, smør eller cremer\nDæk til med rent, ikke-klæbende stof\nTag et smertestillende middel, hvis smerten er intens\nSøg lægehjælp, hvis området er stort, eller det ikke bedres inden for 5 dage');
  trad(378, 'herramienta.9.grado2_titulo',       'herramienta', '2.º grado — Parcial', '2nd degree — Partial', '2. grad — Delvis', '2e degré — Partiel', '2n grau — Parcial', '2. grad — Delvis');
  trad(379, 'herramienta.9.grado2_sintomas',     'herramienta',
    'Piel enrojecida, húmeda y con ampollas\nDolor muy intenso\nAfecta la epidermis y parte de la dermis\nPosible hinchazón',
    'Red, moist skin with blisters\nVery intense pain\nAffects epidermis and part of the dermis\nPossible swelling',
    'Rød, fuktig hud med blemmer\nSvært intens smerte\nPåvirker overhuden og deler av underhuden\nMulig hevelse',
    'Peau rouge, humide et avec des ampoules\nDouleur très intense\nAffecte l\'épiderme et une partie du derme\nGonflement possible',
    'Pell vermella, humida i amb butllofes\nDolor molt intens\nAfecta l\'epidermis i part de la dermis\nPossible inflor',
    'Rød, fugtig hud med blærer\nMeget intens smerte\nPåvirker overhuden og dele af læderhuden\nMulig hævelse');
  trad(380, 'herramienta.9.grado2_tratamiento',  'herramienta',
    'Aplica agua fría corriente durante 15–20 minutos\nNO revientes las ampollas (protegen contra infección)\nCubre con gasa estéril húmeda sin apretar\nRetira ropa y joyas si no están pegadas a la piel\nAcude a urgencias o llama al 112 si es una zona grande o sensible',
    'Apply cool running water for 15–20 minutes\nDO NOT burst the blisters (they protect against infection)\nCover loosely with moist sterile gauze\nRemove clothing and jewellery if not stuck to skin\nGo to the emergency room or call 112 if it is a large or sensitive area',
    'Påfør kjølig rennende vann i 15–20 minutter\nIKKE spreng blemmene (de beskytter mot infeksjon)\nDekk løst med fuktig steril gasbind\nFjern klær og smykker hvis de ikke sitter fast i huden\nOppsøk legevakten eller ring 112 hvis det er et stort eller sensitivt område',
    'Appliquez de l\'eau froide courante pendant 15–20 minutes\nNE crevez PAS les ampoules (elles protègent contre l\'infection)\nCouvrez sans serrer avec une gaze stérile humide\nRetirez vêtements et bijoux s\'ils ne collent pas à la peau\nRendez-vous aux urgences ou appelez le 112 si la zone est grande ou sensible',
    'Aplica aigua freda corrent durant 15–20 minuts\nNO rebentis les butllofes (protegeixen contra la infecció)\nCobreix amb gasa estèril humida sense apretar\nRetira roba i joies si no estan enganxades a la pell\nAcudeix a urgències o truca al 112 si és una zona gran o sensible',
    'Påfør køligt rindende vand i 15–20 minutter\nSPRING IKKE blærerne (de beskytter mod infektion)\nDæk løst med fugtigt sterilt gazebind\nFjern tøj og smykker, hvis de ikke sidder fast i huden\nTag på skadestuen eller ring 112, hvis det er et stort eller sensitivt område');
  trad(381, 'herramienta.9.grado3_titulo',       'herramienta', '3.er grado — Profundo', '3rd degree — Deep', '3. grad — Dyp', '3e degré — Profond', '3r grau — Profund', '3. grad — Dyb');
  trad(382, 'herramienta.9.grado3_sintomas',     'herramienta',
    'Piel blanquecina, marrón, negra o carbonizada\nAspecto seco, coriáceo o apergaminado\nPoco o ningún dolor — los nervios están destruidos (¡engañoso!)\nAfecta todas las capas de la piel',
    'Whitish, brown, black or charred skin\nDry, leathery or parchment-like appearance\nLittle or no pain — nerves are destroyed (deceptive!)\nAffects all layers of the skin',
    'Hvitaktig, brun, svart eller forkullet hud\nTørt, læraktig eller pergamentaktig utseende\nLite eller ingen smerte — nervene er ødelagte (villedende!)\nPåvirker alle hudlag',
    'Peau blanchâtre, brune, noire ou carbonisée\nAspect sec, coriace ou parcheminé\nPeu ou pas de douleur — les nerfs sont détruits (trompeur !)\nAffecte toutes les couches de la peau',
    'Pell blanquinosa, marró, negra o carbonitzada\nAspecte sec, coriaci o apergaminat\nPoc o cap dolor — els nervis estan destruïts (enganyós!)\nAfecta totes les capes de la pell',
    'Hvidlig, brun, sort eller forkullede hud\nTørt, læderagtigt eller pergamentagtigt udseende\nLidt eller ingen smerte — nerverne er ødelagt (vildledende!)\nPåvirker alle hudlag');
  trad(383, 'herramienta.9.grado3_tratamiento',  'herramienta',
    'Llama al 112 INMEDIATAMENTE\nNo retires ropa o materiales pegados a la piel\nCubre con tela limpia y seca\nNo apliques agua si la quemadura es muy extensa\nMantén a la persona caliente y tranquila hasta que llegue la ayuda',
    'Call 112 IMMEDIATELY\nDo not remove clothing or materials stuck to skin\nCover with clean, dry cloth\nDo not apply water if the burn is very extensive\nKeep the person warm and calm until help arrives',
    'Ring 112 UMIDDELBART\nIkke fjern klær eller materialer som sitter fast i huden\nDekk til med rent, tørt stoff\nIkke påfør vann hvis forbrenningen er svært omfattende\nHold personen varm og rolig til hjelp ankommer',
    'Appelez le 112 IMMÉDIATEMENT\nNe retirez pas les vêtements ou matériaux collés à la peau\nCouvrez avec un tissu propre et sec\nN\'appliquez pas d\'eau si la brûlure est très étendue\nGardez la personne au chaud et au calme jusqu\'à l\'arrivée des secours',
    'Truca al 112 IMMEDIATAMENT\nNo retires roba o materials enganxats a la pell\nCobreix amb tela neta i seca\nNo apliquis aigua si la cremada és molt extensa\nMantén la persona calenta i tranquil·la fins que arribi l\'ajuda',
    'Ring 112 ØJEBLIKKELIGT\nFjern ikke tøj eller materialer, der sidder fast i huden\nDæk til med rent, tørt stof\nPåfør ikke vand, hvis forbrændingen er meget udbredt\nHold personen varm og rolig, indtil hjælp ankommer');
  trad(384, 'herramienta.9.grado3_grave',        'herramienta', 'GRAVE', 'SEVERE', 'ALVORLIG', 'GRAVE', 'GREU', 'ALVORLIG');
  trad(385, 'herramienta.9.como_identificar',    'herramienta', 'Cómo identificarlo', 'How to identify it', 'Slik identifiserer du det', 'Comment l\'identifier', 'Com identificar-lo', 'Sådan identificeres det');
  trad(386, 'herramienta.9.que_hacer',           'herramienta', 'Qué hacer', 'What to do', 'Hva du skal gjøre', 'Que faire', 'Què fer', 'Hvad man skal gøre');
  trad(387, 'herramienta.9.no_hagas',            'herramienta', 'NO hagas esto', 'Do NOT do this', 'IKKE gjør dette', 'NE faites PAS ceci', 'NO facis això', 'GØR IKKE dette');
  trad(388, 'herramienta.9.no_hagas_items',      'herramienta',
    'Aplicar hielo directamente (provoca crioquemadura sobre la herida)\nUsar mantequilla, aceite o pasta de dientes (atrapan calor y favorecen infección)\nReventar ampollas (son barrera natural contra la infección)\nArrancar ropa o materiales pegados a la piel\nCubrir con algodón o materiales que se adhieran',
    'Apply ice directly (causes frostbite on the wound)\nUse butter, oil or toothpaste (trap heat and promote infection)\nBurst blisters (natural barrier against infection)\nTear off clothing or materials stuck to skin\nCover with cotton or adhesive materials',
    'Påfør is direkte (forårsaker frostskade på såret)\nBruk smør, olje eller tannkrem (fanger varme og fremmer infeksjon)\nSpreng blemmer (naturlig barriere mot infeksjon)\nRiv av klær eller materialer som sitter fast i huden\nDekk til med bomull eller klebende materialer',
    'Appliquer de la glace directement (provoque des gelures sur la plaie)\nUtiliser du beurre, de l\'huile ou du dentifrice (emprisonnent la chaleur et favorisent l\'infection)\nCrever les ampoules (barrière naturelle contre l\'infection)\nArracher les vêtements ou matériaux collés à la peau\nCouvrir avec du coton ou des matériaux adhérents',
    'Aplicar gel directament (provoca crioquemadura sobre la ferida)\nFer servir mantequilla, oli o pasta de dents (atrapen calor i afavoreixen infecció)\nRebentar butllofes (barriera natural contra la infecció)\nArrencar roba o materials enganxats a la pell\nCobreix amb cotó o materials que s\'enganxin',
    'Påfør is direkte (forårsager frostskade på såret)\nBrug smør, olie eller tandpasta (fanger varme og fremmer infektion)\nSpring blærer (naturlig barriere mod infektion)\nRiv tøj eller materialer af, der sidder fast i huden\nDæk til med bomuld eller klæbende materialer');
  trad(389, 'herramienta.9.llama_112',           'herramienta', 'Llama al 112 si...', 'Call 112 if...', 'Ring 112 hvis...', 'Appelez le 112 si...', 'Truca al 112 si...', 'Ring 112 hvis...');
  trad(390, 'herramienta.9.llama_112_items',     'herramienta',
    'Cualquier quemadura de 3.er grado\nQuemadura en cara, manos, pies, genitales o articulaciones\nQuemadura circular (rodea un miembro)\nQuemadura química o eléctrica\nSuperficie >10% en adultos o >5% en niños (2.º grado)\nSignos de inhalación: voz ronca, tos, cejas quemadas',
    'Any 3rd-degree burn\nBurn on face, hands, feet, genitals or joints\nCircumferential burn (surrounds a limb)\nChemical or electrical burn\nArea >10% in adults or >5% in children (2nd degree)\nInhalation signs: hoarse voice, cough, singed eyebrows',
    'Enhver 3. grads forbrenning\nForbrenning i ansikt, hender, føtter, kjønnsorgan eller ledd\nSirkulær forbrenning (omgir et lem)\nKjemisk eller elektrisk forbrenning\nOmråde >10% hos voksne eller >5% hos barn (2. grad)\nInhalasjonssymptomer: hes stemme, hoste, svedde øyenbryn',
    'Toute brûlure du 3e degré\nBrûlure sur le visage, les mains, les pieds, les organes génitaux ou les articulations\nBrûlure circulaire (entourant un membre)\nBrûlure chimique ou électrique\nSuperficie >10% chez l\'adulte ou >5% chez l\'enfant (2e degré)\nSigles d\'inhalation : voix rauque, toux, sourcils brûlés',
    'Qualsevol cremada de 3r grau\nCremada a la cara, mans, peus, genitals o articulacions\nCremada circular (envolta un membre)\nCremada química o elèctrica\nSuperfície >10% en adults o >5% en nens (2n grau)\nSigles d\'inhalació: veu ronca, tos, celles cremades',
    'Enhver 3. grads forbrænding\nForbrænding på ansigt, hænder, fødder, kønsdele eller led\nCirkulær forbrænding (omslutter et lem)\nKemisk eller elektrisk forbrænding\nAreal >10% hos voksne eller >5% hos børn (2. grad)\nInhalationssymptomer: hæs stemme, hoste, svedne øjenbryn');

  await batch4.commit();
  console.log('✓ Traducciones subidas (403 claves, idiomas es + en + no + fr + ca + da)');

  console.log('\n✅ Seed completado. Firestore tiene todos los datos.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
