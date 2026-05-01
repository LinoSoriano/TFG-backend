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
  batch1.set(db.collection('idiomas').doc('es'), {
    codigo_lenguaje: 'es',
    nombre_lenguaje: 'Español',
  });
  batch1.set(db.collection('idiomas').doc('en'), {
    codigo_lenguaje: 'en',
    nombre_lenguaje: 'English',
  });

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
    // Nodo 1
    { id_nodo: 1, texto: 'Sí, el entorno es seguro', nodo_siguiente: 2, emergencia_resultante: null },
    { id_nodo: 1, texto: 'No, hay peligro (incendio, tráfico, cables, etc.)', nodo_siguiente: null, emergencia_resultante: 1 },
    // Nodo 2
    { id_nodo: 2, texto: 'Sí, responde (consciente)', nodo_siguiente: 3, emergencia_resultante: null },
    { id_nodo: 2, texto: 'No responde (inconsciente)', nodo_siguiente: 5, emergencia_resultante: null },
    // Nodo 3
    { id_nodo: 3, texto: 'Habla o tose con normalidad', nodo_siguiente: 4, emergencia_resultante: null },
    { id_nodo: 3, texto: 'Tiene dolor u opresión en el pecho', nodo_siguiente: null, emergencia_resultante: 6 },
    { id_nodo: 3, texto: 'Tiene debilidad en un lado del cuerpo o dificultad para hablar', nodo_siguiente: null, emergencia_resultante: 5 },
    { id_nodo: 3, texto: 'Presenta hemorragias externas', nodo_siguiente: null, emergencia_resultante: 4 },
    { id_nodo: 3, texto: 'Es diabético con sudor frío y temblores', nodo_siguiente: null, emergencia_resultante: 3 },
    { id_nodo: 3, texto: 'Otra emergencia', nodo_siguiente: null, emergencia_resultante: 2 },
    // Nodo 4
    { id_nodo: 4, texto: 'Sí, puede hablar o toser', nodo_siguiente: null, emergencia_resultante: 2 },
    { id_nodo: 4, texto: 'No puede hablar ni toser - Se lleva las manos al cuello', nodo_siguiente: null, emergencia_resultante: 7 },
    // Nodo 5
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
    // Infarto (guia 1)
    { id: '1',  id_guia: 1, titulo: 'Activar servicios de emergencia', contenido: 'Activar inmediatamente los servicios de emergencia (112)', orden: 1 },
    { id: '2',  id_guia: 1, titulo: 'Mantener en reposo', contenido: 'Mantener a la persona en reposo y tranquila', orden: 2 },
    { id: '3',  id_guia: 1, titulo: 'Vigilar consciencia', contenido: 'Vigilar el estado de conciencia y respiración', orden: 3 },
    { id: '4',  id_guia: 1, titulo: 'Preparar RCP', contenido: 'Prepararse para iniciar RCP si pierde el conocimiento', orden: 4 },
    // PCR (guia 2)
    { id: '5',  id_guia: 2, titulo: 'Llamar a emergencias', contenido: 'Llamar inmediatamente a emergencias (112)', orden: 1 },
    { id: '6',  id_guia: 2, titulo: 'Iniciar RCP', contenido: 'Iniciar maniobras de RCP (30 compresiones / 2 ventilaciones)', orden: 2 },
    { id: '7',  id_guia: 2, titulo: 'Usar DEA', contenido: 'Utilizar un DEA si está disponible', orden: 3 },
    // Ictus (guia 3)
    { id: '8',  id_guia: 3, titulo: 'Llamar al 112', contenido: 'Contactar a emergencias de inmediato (112)', orden: 1 },
    { id: '9',  id_guia: 3, titulo: 'No esperar', contenido: 'No esperar: el tiempo es crítico para limitar el daño cerebral', orden: 2 },
    // Epilepsia (guia 4)
    { id: '10', id_guia: 4, titulo: 'Proteger la cabeza', contenido: 'Proteger la cabeza y evitar objetos duros alrededor', orden: 1 },
    { id: '11', id_guia: 4, titulo: 'No intervenir', contenido: 'No introducir objetos en la boca ni sujetar al paciente', orden: 2 },
    { id: '12', id_guia: 4, titulo: 'Posición lateral', contenido: 'Tras la convulsión, colocar a la persona de lado', orden: 3 },
    // Atragantamiento (guia 5)
    { id: '13', id_guia: 5, titulo: 'Animar a toser', contenido: 'Si puede toser, animar a que lo haga', orden: 1 },
    { id: '14', id_guia: 5, titulo: 'Palmadas', contenido: 'Si no, aplicar 5 palmadas firmes en la espalda', orden: 2 },
    { id: '15', id_guia: 5, titulo: 'Heimlich', contenido: 'Aplicar compresiones abdominales (Maniobra de Heimlich)', orden: 3 },
    // Hemorragia (guia 6)
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
    id_guia: 2,
    id_herramienta: 2,
    orden: 1,
    tipo_relacion: 'complementaria',
  });

  await batch3.commit();
  console.log('✓ Pasos de guías y herramientas subidos');

  // ─── TRADUCCIONES (clave-valor multi-idioma) ──────────────────────────────
  const batch4 = db.batch();
  const trad = (id, nombre, contexto, esText, enText) => {
    batch4.set(db.collection('traducciones').doc(String(id)), {
      id_texto: id,
      nombre_texto: nombre,
      contexto,
      version: '1.0.0',
      traducciones: { es: esText, en: enText },
    });
  };

  // emergencias (1-30)
  trad(1,  'emergencia.1.titulo',       'emergencia', 'Entorno NO Seguro',                                              'Unsafe Environment');
  trad(2,  'emergencia.1.descripcion',  'emergencia', 'NO es seguro. Alerta al 112 y espera a que la zona sea segura.', 'NOT safe. Alert 112 and wait until the area is safe.');
  trad(3,  'emergencia.1.informacion',  'emergencia', 'Tipo de peligro presente (fuego, tráfico, cables eléctricos, etc.)\nUbicación exacta del peligro\nSi hay personas en peligro y cuántas',                                               'Type of hazard present (fire, traffic, electrical cables, etc.)\nExact location of the hazard\nWhether there are people in danger and how many');
  trad(4,  'emergencia.2.titulo',       'emergencia', 'Otra Emergencia',                                                'Other Emergency');
  trad(5,  'emergencia.2.descripcion',  'emergencia', 'Llama al 112 para orientación profesional.',                     'Call 112 for professional guidance.');
  trad(6,  'emergencia.2.informacion',  'emergencia', 'Describe los síntomas o lesiones detectadas con detalle\nAntecedentes médicos relevantes (alergias, medicamentos, enfermedades)',                                                       'Describe the detected symptoms or injuries in detail\nRelevant medical history (allergies, medications, conditions)');
  trad(7,  'emergencia.3.titulo',       'emergencia', 'Posible Hipoglucemia',                                           'Possible Hypoglycemia');
  trad(8,  'emergencia.3.descripcion',  'emergencia', 'Si está consciente, dale azúcar. Llama al 112 si no mejora.',    'If conscious, give sugar. Call 112 if no improvement.');
  trad(9,  'emergencia.3.informacion',  'emergencia', 'La persona es diabética\nPresenta sudor frío, temblores, confusión o debilidad\nSi está consciente y se le ha dado azúcar o zumo',                                                    'The person is diabetic\nPresents cold sweat, tremors, confusion or weakness\nIf conscious and has been given sugar or juice');
  trad(10, 'emergencia.4.titulo',       'emergencia', 'Hemorragia Severa',                                              'Severe Bleeding');
  trad(11, 'emergencia.4.descripcion',  'emergencia', 'Aplica compresión directa inmediatamente y llama al 112.',       'Apply direct pressure immediately and call 112.');
  trad(12, 'emergencia.4.informacion',  'emergencia', 'Localización exacta de la hemorragia\nIntensidad del sangrado (abundante, a borbotones)\nSi has aplicado compresión directa sobre la herida\nSi la persona muestra signos de shock (palidez, sudor frío, temblores)', 'Exact location of the bleeding\nIntensity of bleeding (heavy, spurting)\nIf you have applied direct pressure on the wound\nIf the person shows signs of shock (paleness, cold sweat, tremors)');
  trad(13, 'emergencia.5.titulo',       'emergencia', 'Posible Ictus / AVC',                                            'Possible Stroke / CVA');
  trad(14, 'emergencia.5.descripcion',  'emergencia', 'El tiempo es crítico. Llama al 112 inmediatamente.',             'Time is critical. Call 112 immediately.');
  trad(15, 'emergencia.5.informacion',  'emergencia', 'Debilidad o caída de un lado de la cara\nDesde cuándo comenzaron los síntomas (CRÍTICO)\nSi hay dificultad para hablar o entender\nSi hay debilidad en brazo o pierna',              'Weakness or drooping on one side of the face\nWhen symptoms started (CRITICAL)\nIf there is difficulty speaking or understanding\nIf there is weakness in arm or leg');
  trad(16, 'emergencia.6.titulo',       'emergencia', 'Posible Infarto',                                                'Possible Heart Attack');
  trad(17, 'emergencia.6.descripcion',  'emergencia', 'Llama al 112 y mantén a la persona en reposo.',                  'Call 112 and keep the person at rest.');
  trad(18, 'emergencia.6.informacion',  'emergencia', 'Dolor intenso en el pecho, opresión o fuerte presión\nDesde cuándo lleva el dolor\nSi el dolor irradia hacia brazo, cuello o mandíbula\nSi hay sudor frío, náuseas o dificultad respiratoria', 'Intense chest pain, tightness or strong pressure\nHow long the pain has lasted\nIf the pain radiates to the arm, neck or jaw\nIf there is cold sweat, nausea or breathing difficulty');
  trad(19, 'emergencia.7.titulo',       'emergencia', 'Atragantamiento',                                                'Choking');
  trad(20, 'emergencia.7.descripcion',  'emergencia', 'Aplica palmadas en la espalda y compresiones abdominales.',      'Apply back blows and abdominal compressions.');
  trad(21, 'emergencia.7.informacion',  'emergencia', 'La persona está atragantada (incapaz de hablar)\nSi puede toser o hablar (atragantamiento parcial vs total)\nSi ya ha iniciado maniobras de Heimlich\nSi presenta coloración azulada (cianosis)', 'The person is choking (unable to speak)\nIf they can cough or speak (partial vs total obstruction)\nIf Heimlich maneuver has already been initiated\nIf there is bluish coloration (cyanosis)');
  trad(22, 'emergencia.8.titulo',       'emergencia', 'Ataque Epiléptico',                                              'Epileptic Seizure');
  trad(23, 'emergencia.8.descripcion',  'emergencia', 'Protege a la persona de golpes. No la sujetes ni introduzcas nada en la boca.', 'Protect the person from impacts. Do not restrain them or put anything in their mouth.');
  trad(24, 'emergencia.8.informacion',  'emergencia', 'Duración de las convulsiones\nSi es la primera vez o tiene historial de epilepsia\nSi ha perdido el conocimiento\nSi hay lesiones tras la convulsión', 'Duration of the seizures\nIf it is the first time or has a history of epilepsy\nIf they have lost consciousness\nIf there are injuries after the seizure');
  trad(25, 'emergencia.9.titulo',       'emergencia', 'Parada Cardiorrespiratoria',                                     'Cardiac Arrest');
  trad(26, 'emergencia.9.descripcion',  'emergencia', 'Llama al 112 e inicia RCP inmediatamente (30 compresiones / 2 ventilaciones).', 'Call 112 and start CPR immediately (30 compressions / 2 ventilations).');
  trad(27, 'emergencia.9.informacion',  'emergencia', 'La persona NO respira o respira de forma anormal\nEstá inconsciente, no responde a estímulos\nSi ya has iniciado o iniciarás RCP (30 compresiones / 2 ventilaciones)\nSi hay un DEA (desfibrilador) disponible cerca', 'The person is NOT breathing or breathing abnormally\nUnconscious, does not respond to stimuli\nIf you have started or will start CPR (30 compressions / 2 ventilations)\nIf there is an AED (defibrillator) available nearby');
  trad(28, 'emergencia.10.titulo',      'emergencia', 'Inconsciente pero Respirando',                                   'Unconscious but Breathing');
  trad(29, 'emergencia.10.descripcion', 'emergencia', 'Coloque en Posición Lateral de Seguridad (PLS) y vigile la respiración.', 'Place in Recovery Position and monitor breathing.');
  trad(30, 'emergencia.10.informacion', 'emergencia', 'La persona está inconsciente pero respira\nYa la ha colocado en Posición Lateral de Seguridad (PLS)\nHace cuánto tiempo perdió la consciencia\nSi hay lesiones visibles (golpes en la cabeza, sangrado, etc.)', 'The person is unconscious but breathing\nHas already been placed in Recovery Position\nHow long ago they lost consciousness\nIf there are visible injuries (head blows, bleeding, etc.)');

  // nodos (31-35)
  trad(31, 'nodo.1.pregunta', 'nodo', '¿Es el entorno seguro para mí y para la víctima?',                                              'Is the environment safe for me and the victim?');
  trad(32, 'nodo.2.pregunta', 'nodo', '¿La víctima responde a estímulos al preguntarle "¿Está usted bien?" y sacudirla suavemente?',   'Does the victim respond to stimuli when asked "Are you okay?" and gently shaken?');
  trad(33, 'nodo.3.pregunta', 'nodo', '¿Qué ha pasado? Seleccione lo que mejor describe la situación:',                               'What happened? Select what best describes the situation:');
  trad(34, 'nodo.4.pregunta', 'nodo', '¿Puede hablar o toser? (Si se lleva las manos al cuello y no puede, es atragantamiento total)', 'Can they speak or cough? (If hands go to throat and they cannot, it is complete choking)');
  trad(35, 'nodo.5.pregunta', 'nodo', 'Tras abrir la vía aérea, ¿respira con normalidad?\n(Ver, oír, sentir durante 10 segundos)',     'After opening the airway, are they breathing normally?\n(Look, listen, feel for 10 seconds)');

  // opciones (36-49)
  trad(36, 'opcion.1.texto',  'opcion', 'Sí, el entorno es seguro',                                               'Yes, the environment is safe');
  trad(37, 'opcion.2.texto',  'opcion', 'No, hay peligro (incendio, tráfico, cables, etc.)',                       'No, there is danger (fire, traffic, cables, etc.)');
  trad(38, 'opcion.3.texto',  'opcion', 'Sí, responde (consciente)',                                              'Yes, responds (conscious)');
  trad(39, 'opcion.4.texto',  'opcion', 'No responde (inconsciente)',                                             'Does not respond (unconscious)');
  trad(40, 'opcion.5.texto',  'opcion', 'Habla o tose con normalidad',                                           'Speaks or coughs normally');
  trad(41, 'opcion.6.texto',  'opcion', 'Tiene dolor u opresión en el pecho',                                    'Has chest pain or tightness');
  trad(42, 'opcion.7.texto',  'opcion', 'Tiene debilidad en un lado del cuerpo o dificultad para hablar',        'Has weakness on one side of body or difficulty speaking');
  trad(43, 'opcion.8.texto',  'opcion', 'Presenta hemorragias externas',                                         'Has external bleeding');
  trad(44, 'opcion.9.texto',  'opcion', 'Es diabético con sudor frío y temblores',                               'Diabetic with cold sweat and tremors');
  trad(45, 'opcion.10.texto', 'opcion', 'Otra emergencia',                                                       'Other emergency');
  trad(46, 'opcion.11.texto', 'opcion', 'Sí, puede hablar o toser',                                             'Yes, can speak or cough');
  trad(47, 'opcion.12.texto', 'opcion', 'No puede hablar ni toser - Se lleva las manos al cuello',               'Cannot speak or cough – Hands go to throat');
  trad(48, 'opcion.13.texto', 'opcion', 'No respira o respiración anormal → PARADA CARDÍACA',                  'Not breathing or abnormal breathing → CARDIAC ARREST');
  trad(49, 'opcion.14.texto', 'opcion', 'Sí, respira normalmente',                                              'Yes, breathing normally');

  // guias (50-61)
  trad(50, 'guia.1.titulo',      'guia', 'Infarto',                                                        'Heart Attack');
  trad(51, 'guia.1.descripcion', 'guia', 'Guía de actuación ante un posible infarto de miocardio.',        'Action guide for a possible myocardial infarction.');
  trad(52, 'guia.2.titulo',      'guia', 'Parada Cardiorrespiratoria',                                     'Cardiac Arrest');
  trad(53, 'guia.2.descripcion', 'guia', 'Guía de actuación ante una parada cardiorrespiratoria.',         'Action guide for a cardiac arrest.');
  trad(54, 'guia.3.titulo',      'guia', 'Ictus',                                                          'Stroke');
  trad(55, 'guia.3.descripcion', 'guia', 'Guía de actuación ante un posible ictus o AVC.',                 'Action guide for a possible stroke or CVA.');
  trad(56, 'guia.4.titulo',      'guia', 'Ataque Epiléptico',                                              'Epileptic Seizure');
  trad(57, 'guia.4.descripcion', 'guia', 'Guía de actuación ante un ataque epiléptico.',                   'Action guide for an epileptic seizure.');
  trad(58, 'guia.5.titulo',      'guia', 'Obstrucción de Vía Aérea',                                       'Airway Obstruction');
  trad(59, 'guia.5.descripcion', 'guia', 'Guía de actuación ante un atragantamiento.',                     'Action guide for choking.');
  trad(60, 'guia.6.titulo',      'guia', 'Hemorragia Severa',                                              'Severe Bleeding');
  trad(61, 'guia.6.descripcion', 'guia', 'Guía de actuación ante una hemorragia severa.',                  'Action guide for severe bleeding.');

  // pasos (62-99)
  trad(62,  'paso.1.titulo',     'paso', 'Activar servicios de emergencia',          'Activate emergency services');
  trad(63,  'paso.1.contenido',  'paso', 'Activar inmediatamente los servicios de emergencia (112)',  'Immediately activate emergency services (112)');
  trad(64,  'paso.2.titulo',     'paso', 'Mantener en reposo',                        'Keep at rest');
  trad(65,  'paso.2.contenido',  'paso', 'Mantener a la persona en reposo y tranquila',               'Keep the person at rest and calm');
  trad(66,  'paso.3.titulo',     'paso', 'Vigilar consciencia',                       'Monitor consciousness');
  trad(67,  'paso.3.contenido',  'paso', 'Vigilar el estado de conciencia y respiración',             'Monitor the state of consciousness and breathing');
  trad(68,  'paso.4.titulo',     'paso', 'Preparar RCP',                              'Prepare CPR');
  trad(69,  'paso.4.contenido',  'paso', 'Prepararse para iniciar RCP si pierde el conocimiento',     'Be ready to start CPR if they lose consciousness');
  trad(70,  'paso.5.titulo',     'paso', 'Llamar a emergencias',                      'Call emergency services');
  trad(71,  'paso.5.contenido',  'paso', 'Llamar inmediatamente a emergencias (112)',                 'Immediately call emergency services (112)');
  trad(72,  'paso.6.titulo',     'paso', 'Iniciar RCP',                               'Start CPR');
  trad(73,  'paso.6.contenido',  'paso', 'Iniciar maniobras de RCP (30 compresiones / 2 ventilaciones)', 'Start CPR (30 compressions / 2 ventilations)');
  trad(74,  'paso.7.titulo',     'paso', 'Usar DEA',                                  'Use AED');
  trad(75,  'paso.7.contenido',  'paso', 'Utilizar un DEA si está disponible',                        'Use an AED if available');
  trad(76,  'paso.8.titulo',     'paso', 'Llamar al 112',                             'Call 112');
  trad(77,  'paso.8.contenido',  'paso', 'Contactar a emergencias de inmediato (112)',                 'Contact emergency services immediately (112)');
  trad(78,  'paso.9.titulo',     'paso', 'No esperar',                                'Do not wait');
  trad(79,  'paso.9.contenido',  'paso', 'No esperar: el tiempo es crítico para limitar el daño cerebral', 'Do not wait: time is critical to limit brain damage');
  trad(80,  'paso.10.titulo',    'paso', 'Proteger la cabeza',                        'Protect the head');
  trad(81,  'paso.10.contenido', 'paso', 'Proteger la cabeza y evitar objetos duros alrededor',       'Protect the head and remove hard objects from the area');
  trad(82,  'paso.11.titulo',    'paso', 'No intervenir',                             'Do not intervene');
  trad(83,  'paso.11.contenido', 'paso', 'No introducir objetos en la boca ni sujetar al paciente',   'Do not put objects in the mouth or restrain the patient');
  trad(84,  'paso.12.titulo',    'paso', 'Posición lateral',                          'Recovery position');
  trad(85,  'paso.12.contenido', 'paso', 'Tras la convulsión, colocar a la persona de lado',          'After the seizure, place the person on their side');
  trad(86,  'paso.13.titulo',    'paso', 'Animar a toser',                            'Encourage coughing');
  trad(87,  'paso.13.contenido', 'paso', 'Si puede toser, animar a que lo haga',                      'If they can cough, encourage them to do so');
  trad(88,  'paso.14.titulo',    'paso', 'Palmadas',                                  'Back blows');
  trad(89,  'paso.14.contenido', 'paso', 'Si no, aplicar 5 palmadas firmes en la espalda',            'If not, apply 5 firm back blows between shoulder blades');
  trad(90,  'paso.15.titulo',    'paso', 'Heimlich',                                  'Heimlich');
  trad(91,  'paso.15.contenido', 'paso', 'Aplicar compresiones abdominales (Maniobra de Heimlich)',   'Apply abdominal thrusts (Heimlich maneuver)');
  trad(92,  'paso.16.titulo',    'paso', 'Llamar al 112',                             'Call 112');
  trad(93,  'paso.16.contenido', 'paso', 'Llamar inmediatamente al 112',                              'Call 112 immediately');
  trad(94,  'paso.17.titulo',    'paso', 'Compresión directa',                        'Direct pressure');
  trad(95,  'paso.17.contenido', 'paso', 'Aplicar compresión directa y continua sobre la herida con un paño limpio', 'Apply direct and continuous pressure on the wound with a clean cloth');
  trad(96,  'paso.18.titulo',    'paso', 'Añadir capas',                              'Add layers');
  trad(97,  'paso.18.contenido', 'paso', 'Si la sangre empapa el paño, añadir más capas sin quitar las anteriores', 'If blood soaks through, add more layers without removing the previous ones');
  trad(98,  'paso.19.titulo',    'paso', 'Elevar extremidad',                         'Elevate the limb');
  trad(99,  'paso.19.contenido', 'paso', 'Elevar la extremidad lesionada si es posible y no hay fractura', 'Elevate the injured limb if possible and there is no fracture');

  // herramientas (100-113)
  trad(100, 'herramienta.1.nombre',      'herramienta', 'Asistente llamada 112',                  '112 Call Assistant');
  trad(101, 'herramienta.1.descripcion', 'herramienta', 'Geolocalización automática y guía estructurada para comunicarte con emergencias', 'Automatic geolocation and structured guide to communicate with emergency services');
  trad(102, 'herramienta.2.nombre',      'herramienta', 'Asistente de RCP',                       'CPR Assistant');
  trad(103, 'herramienta.2.descripcion', 'herramienta', 'Metrónomo 100 rpm, medidor de profundidad, temporizador de ciclos y contador',   '100 bpm metronome, depth meter, cycle timer and counter');
  trad(104, 'herramienta.3.nombre',      'herramienta', 'Medidor de frecuencia cardíaca',          'Heart rate monitor');
  trad(105, 'herramienta.3.descripcion', 'herramienta', 'Medición de la frecuencia cardíaca por fotopletismografía (cámara)',             'Heart rate measurement by photoplethysmography (camera)');
  trad(106, 'herramienta.4.nombre',      'herramienta', 'Test de detección de Ictus',              'Stroke detection test');
  trad(107, 'herramienta.4.descripcion', 'herramienta', 'Método FAST para identificar rápidamente un posible accidente cerebrovascular',  'FAST method to quickly identify a possible stroke');
  trad(108, 'herramienta.5.nombre',      'herramienta', 'Calculadora de quemaduras',               'Burns calculator');
  trad(109, 'herramienta.5.descripcion', 'herramienta', 'Estima el porcentaje de superficie corporal quemada con la Regla de los 9',      'Estimates the percentage of burned body surface using the Rule of Nines');
  trad(110, 'herramienta.6.nombre',      'herramienta', 'Registro de exploración secundaria',      'Secondary survey log');
  trad(111, 'herramienta.6.descripcion', 'herramienta', 'Anota signos, síntomas y observaciones para entregar al personal sanitario',     'Record signs, symptoms and observations for medical personnel');
  trad(112, 'herramienta.7.nombre',      'herramienta', 'Ficha médica de emergencia',              'Emergency medical record');
  trad(113, 'herramienta.7.descripcion', 'herramienta', 'Alergias, medicación y contactos de emergencia guardados en el dispositivo',     'Allergies, medication and emergency contacts stored on the device');

  // ui común (114-117)
  trad(114, 'ui.llamar112',      'ui', '¡LLAMA AL 112!',  'CALL 112!');
  trad(115, 'ui.boton.anterior', 'ui', 'Anterior',         'Previous');
  trad(116, 'ui.boton.siguiente','ui', 'Siguiente',        'Next');
  trad(117, 'ui.boton.reiniciar','ui', 'Reiniciar',        'Restart');

  // navegación (118-120)
  trad(118, 'nav.inicio',       'nav', 'Inicio',       'Home');
  trad(119, 'nav.guias',        'nav', 'Guías',        'Guides');
  trad(120, 'nav.herramientas', 'nav', 'Herramientas', 'Tools');

  // cuestionario (121-122)
  trad(121, 'cuestionario.titulo',          'cuestionario', 'Identificador de\nEmergencias', 'Emergency\nIdentifier');
  trad(122, 'cuestionario.preguntaAnterior','cuestionario', 'Pregunta anterior',              'Previous question');

  // resultado emergencia (123-137)
  trad(123, 'resultado.tituloApp',       'resultado', 'Identificador de Emergencias',                              'Emergency Identifier');
  trad(124, 'resultado.llamarAhora',     'resultado', 'LLAMA AL 112 AHORA',                                        'CALL 112 NOW');
  trad(125, 'resultado.proporcionaInfo', 'resultado', 'Proporciona esta información al operador:',                  'Provide this information to the operator:');
  trad(126, 'resultado.llamar',          'resultado', 'Llamar al 112',                                             'Call 112');
  trad(127, 'resultado.infoEspecifica',  'resultado', 'Información específica para esta emergencia:',              'Specific information for this emergency:');
  trad(128, 'resultado.infoGeneral',     'resultado', 'Información general a mencionar:',                          'General information to mention:');
  trad(129, 'resultado.noCuelgues',      'resultado', 'NO CUELGUES. Permanece en línea y sigue las instrucciones del operador.', 'DO NOT HANG UP. Stay on the line and follow the operator\'s instructions.');
  trad(130, 'resultado.reiniciar',       'resultado', 'Reiniciar',                                                 'Restart');
  trad(131, 'resultado.verGuia',         'resultado', 'Ver guía completa',                                         'View full guide');
  trad(132, 'resultado.info1',           'resultado', 'Ubicación exacta: calle, número, población y puntos de referencia', 'Exact location: street, number, town and landmarks');
  trad(133, 'resultado.info2',           'resultado', 'Qué ha ocurrido (accidente, desmayo, caída, etc.)',          'What happened (accident, fainting, fall, etc.)');
  trad(134, 'resultado.info3',           'resultado', 'Número de personas afectadas',                               'Number of people affected');
  trad(135, 'resultado.info4',           'resultado', 'Edad aproximada de la víctima',                              'Approximate age of the victim');
  trad(136, 'resultado.info5',           'resultado', 'Si está consciente o inconsciente',                          'Whether conscious or unconscious');
  trad(137, 'resultado.info6',           'resultado', 'Si respira o no respira',                                    'Whether breathing or not');

  // guías list (138-140)
  trad(138, 'guias.titulo',      'guias', 'Guías de Emergencias',                                    'Emergency Guides');
  trad(139, 'guias.subtitulo',   'guias', 'Selecciona la emergencia para ver la guía completa',       'Select an emergency to see the full guide');
  trad(140, 'guias.tocaParaVer', 'guias', 'Toca para ver la guía de actuación',                       'Tap to view the action guide');

  // guía detalle (141-144)
  trad(141, 'guia.comoDetectarlo', 'guia', 'Cómo detectarlo',    'How to detect it');
  trad(142, 'guia.comoActuar',     'guia', 'Cómo actuar',        'How to act');
  trad(143, 'guia.pasosASeguir',   'guia', 'Pasos a seguir',     'Steps to follow');
  trad(144, 'guia.todosLosPasos',  'guia', 'Todos los pasos:',   'All steps:');

  // herramientas list (145-151)
  trad(145, 'herramientas.titulo',         'herramientas', 'Herramientas',                                'Tools');
  trad(146, 'herramientas.subtitulo',       'herramientas', 'Herramientas interactivas de soporte',        'Interactive support tools');
  trad(147, 'herramientas.cat.alerta',      'herramientas', 'Gestión de Alerta y Ubicación',              'Alert and Location Management');
  trad(148, 'herramientas.cat.reaccion',    'herramientas', 'Guías de Reacción Inmediata',                'Immediate Reaction Guides');
  trad(149, 'herramientas.cat.diagnostico', 'herramientas', 'Herramientas de Identificación y Diagnóstico','Identification and Diagnosis Tools');
  trad(150, 'herramientas.cat.info',        'herramientas', 'Información Médica Crítica',                 'Critical Medical Information');
  trad(151, 'herramientas.aviso',           'herramientas', 'ℹ Acerca de las herramientas\n\nEstas herramientas aplican el protocolo PAS (Proteger-Alertar-Socorrer) y están diseñadas para asistir en situaciones de emergencia. Son de carácter orientativo y no sustituyen la atención médica profesional ni la llamada al 112.', 'ℹ About the tools\n\nThese tools apply the PAS protocol (Protect-Alert-Assist) and are designed to assist in emergency situations. They are for guidance only and do not replace professional medical care or calling 112.');

  // configuración (152-184)
  trad(152, 'config.titulo',               'config', 'Configuración',                                      'Settings');
  trad(153, 'config.idioma',               'config', 'Idioma',                                             'Language');
  trad(154, 'config.disponible',           'config', 'Disponible',                                         'Available');
  trad(155, 'config.noDescargado',         'config', 'No descargado',                                      'Not downloaded');
  trad(156, 'config.apariencia',           'config', 'Apariencia',                                         'Appearance');
  trad(157, 'config.tamanoLetra',          'config', 'Tamaño de letra',                                    'Font size');
  trad(158, 'config.tamano.pequeño',       'config', 'Pequeño',                                            'Small');
  trad(159, 'config.tamano.reducido',      'config', 'Reducido',                                           'Reduced');
  trad(160, 'config.tamano.normal',        'config', 'Normal',                                             'Normal');
  trad(161, 'config.tamano.grande',        'config', 'Grande',                                             'Large');
  trad(162, 'config.tamano.muyGrande',     'config', 'Muy grande',                                         'Very large');
  trad(163, 'config.vistaPrevia',          'config', 'Vista previa del texto en la aplicación.',           'Preview of text in the app.');
  trad(164, 'config.datosLocales',         'config', 'Datos locales',                                      'Local data');
  trad(165, 'config.avisoLegal',           'config', 'Aviso legal',                                        'Legal notice');
  trad(166, 'config.avisoAceptado',        'config', 'Aceptado',                                           'Accepted');
  trad(167, 'config.avisoNoAceptado',      'config', 'No aceptado todavía',                                'Not yet accepted');
  trad(168, 'config.restablecer',          'config', 'Restablecer',                                        'Reset');
  trad(169, 'config.fichaMedica',          'config', 'Ficha médica',                                       'Medical record');
  trad(170, 'config.eliminarDatos',        'config', 'Eliminar datos guardados localmente',                 'Delete locally saved data');
  trad(171, 'config.borrar',               'config', 'Borrar',                                             'Delete');
  trad(172, 'config.acercaDe',             'config', 'Acerca de la aplicación',                            'About the app');
  trad(173, 'config.version',              'config', 'Versión',                                            'Version');
  trad(174, 'config.autor',                'config', 'Autor',                                              'Author');
  trad(175, 'config.proyecto',             'config', 'Proyecto',                                           'Project');
  trad(176, 'config.tutor',                'config', 'Tutor',                                              'Tutor');
  trad(177, 'config.infoLegal',            'config', 'Información legal',                                  'Legal information');
  trad(178, 'config.avisoImportante',      'config', 'Aviso importante',                                   'Important notice');
  trad(179, 'config.avisoImportanteTexto', 'config', 'Esta aplicación proporciona información orientativa de primeros auxilios. No sustituye la atención médica profesional ni la llamada al 112.', 'This application provides guidance on first aid. It does not replace professional medical care or calling 112.');
  trad(180, 'config.privacidad',           'config', 'Privacidad',                                         'Privacy');
  trad(181, 'config.privacidadTexto',      'config', 'La ficha médica y las observaciones de exploración se almacenan únicamente en tu dispositivo y no se envían a ningún servidor externo.',    'The medical record and examination observations are stored only on your device and are not sent to any external server.');
  trad(182, 'config.sincContenido',        'config', 'Sincronización de contenido',                        'Content synchronization');
  trad(183, 'config.sincContenidoTexto',   'config', 'Las guías y el árbol de emergencias se sincronizan con el servidor para mantenerse actualizados. No se recogen datos personales.',           'The guides and emergency decision tree are synchronized with the server to stay updated. No personal data is collected.');
  trad(184, 'config.cargandoIdiomas',      'config', 'Cargando idiomas...',                                'Loading languages...');

  // diálogos (185-192)
  trad(185, 'dialog.cancelar',          'dialog', 'Cancelar',                                            'Cancel');
  trad(186, 'dialog.confirmar',         'dialog', 'Confirmar',                                           'Confirm');
  trad(187, 'dialog.restablecerTitulo', 'dialog', 'Restablecer aviso legal',                             'Reset legal notice');
  trad(188, 'dialog.restablecerTexto',  'dialog', 'El aviso legal se mostrará de nuevo la próxima vez que abras la aplicación. ¿Continuar?', 'The legal notice will be shown again the next time you open the app. Continue?');
  trad(189, 'dialog.restablecidoMsg',   'dialog', 'Aviso legal restablecido. Se mostrará al reiniciar la app.', 'Legal notice reset. It will be shown on app restart.');
  trad(190, 'dialog.borrarFichaTitulo', 'dialog', 'Borrar ficha médica',                                 'Delete medical record');
  trad(191, 'dialog.borrarFichaTexto',  'dialog', 'Se eliminarán todos los datos de tu ficha médica guardados en el dispositivo. Esta acción no se puede deshacer.', 'All your medical record data saved on your device will be deleted. This action cannot be undone.');
  trad(192, 'dialog.fichaEliminada',    'dialog', 'Ficha médica eliminada.',                              'Medical record deleted.');

  await batch4.commit();
  console.log('✓ Traducciones subidas (192 claves, idiomas es + en)');

  console.log('\n✅ Seed completado. Firestore tiene todos los datos.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
