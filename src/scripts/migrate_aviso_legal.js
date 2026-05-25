require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/firebase');

async function migrate() {
  console.log('Añadiendo claves 193-212 que faltan en Firestore...');

  const trad = (id, nombre, contexto, esText, enText) =>
    db.collection('traducciones').doc(String(id)).set(
      {
        id_texto: id,
        nombre_texto: nombre,
        contexto,
        version: '1.0.0',
        traducciones: { es: esText, en: enText },
      },
      { merge: true },
    );

  await Promise.all([
    // cuenta y apariencia (193-202)
    trad(193, 'config.iniciarSesion',         'config', 'Iniciar sesión',                                     'Sign in'),
    trad(194, 'config.cuenta',                'config', 'Cuenta',                                             'Account'),
    trad(195, 'config.sesionIniciada',        'config', 'Sesión iniciada',                                    'Signed in'),
    trad(196, 'config.cerrarSesion',          'config', 'Cerrar sesión',                                      'Sign out'),
    trad(197, 'config.cuentaSubtitulo',       'config', 'Sincroniza tu ficha médica entre dispositivos',      'Sync your medical card between devices'),
    trad(198, 'config.paleta',                'config', 'Color de la aplicación',                             'App color'),
    trad(199, 'config.paleta.seleccionar',    'config', 'Selecciona un color',                                'Select a color'),
    trad(200, 'config.modoOscuro',            'config', 'Modo oscuro',                                        'Dark mode'),
    trad(201, 'config.modoOscuro.activado',   'config', 'Activado',                                           'On'),
    trad(202, 'config.modoOscuro.desactivado','config', 'Desactivado',                                        'Off'),

    // diálogos de sesión (203-205)
    trad(203, 'dialog.cerrarSesionTitulo',    'dialog', 'Cerrar sesión',                                      'Sign out'),
    trad(204, 'dialog.cerrarSesionTexto',     'dialog', '¿Seguro que quieres cerrar sesión?',                 'Are you sure you want to sign out?'),
    trad(205, 'config.tamano.extraGrande',    'config', 'Extra grande',                                       'Extra large'),

    // aviso legal (206-212)
    trad(206, 'avisoLegal.titulo',  'avisoLegal', 'Aviso Legal Importante',                                                                                 'Important Legal Notice'),
    trad(207, 'avisoLegal.aviso.1', 'avisoLegal', 'Esta aplicación es una herramienta de APOYO educativo y orientativo.',                                    'This app is an educational and guidance SUPPORT tool.'),
    trad(208, 'avisoLegal.aviso.2', 'avisoLegal', 'NO SUSTITUYE la atención médica profesional ni la llamada obligatoria a los servicios de emergencia.',    'It does NOT replace professional medical care or the mandatory call to emergency services.'),
    trad(209, 'avisoLegal.aviso.3', 'avisoLegal', 'Ante cualquier emergencia, SIEMPRE llama primero al 112 o al número de emergencias de tu país.',          "In any emergency, ALWAYS call 112 first or your country's emergency number."),
    trad(210, 'avisoLegal.aviso.4', 'avisoLegal', 'El uso de esta aplicación es bajo tu propia responsabilidad.',                                            'Use of this application is at your own responsibility.'),
    trad(211, 'avisoLegal.aceptar', 'avisoLegal', 'Entiendo y acepto',                                                                                       'I understand and accept'),
    trad(212, 'avisoLegal.de',      'avisoLegal', 'de',                                                                                                      'of'),
  ]);

  console.log('✅ 20 claves (193-212) añadidas/actualizadas en Firestore.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
