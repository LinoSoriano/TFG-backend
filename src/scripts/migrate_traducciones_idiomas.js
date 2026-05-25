require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/firebase');

async function migrate() {
  console.log('Añadiendo idiomas no/fr/ca/da a las claves 193-212 en Firestore...');

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
    // cuenta y apariencia (193-202)
    trad(193, 'config.iniciarSesion',          'config',
      'Iniciar sesión',                                    'Sign in',
      'Logg inn',                                          'Se connecter',                              'Iniciar sessió',                                          'Log ind'),
    trad(194, 'config.cuenta',                 'config',
      'Cuenta',                                            'Account',
      'Konto',                                             'Compte',                                    'Compte',                                                  'Konto'),
    trad(195, 'config.sesionIniciada',         'config',
      'Sesión iniciada',                                   'Signed in',
      'Innlogget',                                         'Connecté',                                  'Sessió iniciada',                                         'Logget ind'),
    trad(196, 'config.cerrarSesion',           'config',
      'Cerrar sesión',                                     'Sign out',
      'Logg ut',                                           'Se déconnecter',                            'Tancar sessió',                                           'Log ud'),
    trad(197, 'config.cuentaSubtitulo',        'config',
      'Sincroniza tu ficha médica entre dispositivos',     'Sync your medical card between devices',
      'Synkroniser ditt medisinske kort mellom enheter',   'Synchronisez votre fiche médicale entre appareils', 'Sincronitza la teva fitxa mèdica entre dispositius',  'Synkroniser dit medicinske kort mellem enheder'),
    trad(198, 'config.paleta',                 'config',
      'Color de la aplicación',                            'App color',
      'Appens farge',                                      'Couleur de l\'application',                 'Color de l\'aplicació',                                   'Appens farve'),
    trad(199, 'config.paleta.seleccionar',     'config',
      'Selecciona un color',                               'Select a color',
      'Velg en farge',                                     'Sélectionnez une couleur',                  'Selecciona un color',                                     'Vælg en farve'),
    trad(200, 'config.modoOscuro',             'config',
      'Modo oscuro',                                       'Dark mode',
      'Mørk modus',                                        'Mode sombre',                               'Mode fosc',                                               'Mørk tilstand'),
    trad(201, 'config.modoOscuro.activado',    'config',
      'Activado',                                          'On',
      'Aktivert',                                          'Activé',                                    'Activat',                                                 'Aktiveret'),
    trad(202, 'config.modoOscuro.desactivado', 'config',
      'Desactivado',                                       'Off',
      'Deaktivert',                                        'Désactivé',                                 'Desactivat',                                              'Deaktiveret'),

    // diálogos de sesión (203-205)
    trad(203, 'dialog.cerrarSesionTitulo',     'dialog',
      'Cerrar sesión',                                     'Sign out',
      'Logg ut',                                           'Se déconnecter',                            'Tancar sessió',                                           'Log ud'),
    trad(204, 'dialog.cerrarSesionTexto',      'dialog',
      '¿Seguro que quieres cerrar sesión?',                'Are you sure you want to sign out?',
      'Er du sikker på at du vil logge ut?',               'Êtes-vous sûr de vouloir vous déconnecter ?', 'Estàs segur que vols tancar la sessió?',               'Er du sikker på, at du vil logge ud?'),
    trad(205, 'config.tamano.extraGrande',     'config',
      'Extra grande',                                      'Extra large',
      'Ekstra stor',                                       'Extra grand',                               'Extra gran',                                              'Ekstra stor'),

    // aviso legal (206-212)
    trad(206, 'avisoLegal.titulo',  'avisoLegal',
      'Aviso Legal Importante',                            'Important Legal Notice',
      'Viktig Juridisk Merknad',                           'Avis Légal Important',                      'Avís Legal Important',                                    'Vigtig Juridisk Meddelelse'),
    trad(207, 'avisoLegal.aviso.1', 'avisoLegal',
      'Esta aplicación es una herramienta de APOYO educativo y orientativo.',
      'This app is an educational and guidance SUPPORT tool.',
      'Denne appen er et STØTTENDE pedagogisk og veiledende verktøy.',
      'Cette application est un outil de SOUTIEN éducatif et indicatif.',
      'Aquesta aplicació és una eina de SUPORT educatiu i orientatiu.',
      'Denne app er et STØTTENDE pædagogisk og vejledende værktøj.'),
    trad(208, 'avisoLegal.aviso.2', 'avisoLegal',
      'NO SUSTITUYE la atención médica profesional ni la llamada obligatoria a los servicios de emergencia.',
      'It does NOT replace professional medical care or the mandatory call to emergency services.',
      'Den ERSTATTER IKKE profesjonell medisinsk hjelp eller den obligatoriske oppringningen til nødetjenestene.',
      'Elle NE REMPLACE PAS les soins médicaux professionnels ni l\'appel obligatoire aux services d\'urgence.',
      'NO SUBSTITUEIX l\'atenció mèdica professional ni la trucada obligatòria als serveis d\'emergència.',
      'Den ERSTATTER IKKE professionel lægehjælp eller det obligatoriske opkald til nødtjenester.'),
    trad(209, 'avisoLegal.aviso.3', 'avisoLegal',
      'Ante cualquier emergencia, SIEMPRE llama primero al 112 o al número de emergencias de tu país.',
      'In any emergency, ALWAYS call 112 first or your country\'s emergency number.',
      'Ved enhver nødsituasjon, RING ALLTID 112 eller ditt lands nødnummer først.',
      'Face à toute urgence, APPELEZ TOUJOURS d\'abord le 112 ou le numéro d\'urgence de votre pays.',
      'Davant qualsevol emergència, TRUCA SEMPRE primer al 112 o al número d\'emergències del teu país.',
      'Ved enhver nødsituation, RING ALTID 112 eller dit lands nødnummer først.'),
    trad(210, 'avisoLegal.aviso.4', 'avisoLegal',
      'El uso de esta aplicación es bajo tu propia responsabilidad.',
      'Use of this application is at your own responsibility.',
      'Bruken av denne appen skjer på eget ansvar.',
      'L\'utilisation de cette application est sous votre propre responsabilité.',
      'L\'ús d\'aquesta aplicació és sota la teva pròpia responsabilitat.',
      'Brug af denne app sker på eget ansvar.'),
    trad(211, 'avisoLegal.aceptar', 'avisoLegal',
      'Entiendo y acepto',                                 'I understand and accept',
      'Jeg forstår og aksepterer',                         'Je comprends et j\'accepte',                'Entenc i accepto',                                        'Jeg forstår og accepterer'),
    trad(212, 'avisoLegal.de',      'avisoLegal',
      'de',                                                'of',
      'av',                                                'de',                                        'de',                                                      'af'),
  ]);

  console.log('✅ 20 claves (193-212) actualizadas con idiomas no/fr/ca/da en Firestore.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
