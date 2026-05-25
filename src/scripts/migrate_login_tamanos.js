require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { db } = require('../config/firebase');

async function migrate() {
  console.log('Añadiendo claves de login + tamaños + cuestionario web (IDs 391-407)...');

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
    // ── Pantalla de login (391-403) ────────────────────────────────────────
    trad(391, 'login.titulo',                'login', 'Mi cuenta',          'My account',          'Min konto',          'Mon compte',          'El meu compte',          'Min konto'),
    trad(392, 'login.iniciarSesion',         'login', 'Iniciar sesión',     'Sign in',             'Logg inn',           'Se connecter',        'Inicia sessió',          'Log ind'),
    trad(393, 'login.crearCuenta',           'login', 'Crear cuenta',       'Create account',      'Opprett konto',      'Créer un compte',     'Crea un compte',         'Opret konto'),
    trad(394, 'login.correo',                'login', 'Correo electrónico', 'Email',               'E-post',             'E-mail',              'Correu electrònic',      'E-mail'),
    trad(395, 'login.contrasena',            'login', 'Contraseña',         'Password',            'Passord',            'Mot de passe',        'Contrasenya',            'Adgangskode'),
    trad(396, 'login.errorEmailInvalido',    'login',
      'El email no tiene un formato válido.',
      'Invalid email format.',
      'Ugyldig e-postformat.',
      "Format d'e-mail invalide.",
      'El correu no té un format vàlid.',
      'Ugyldigt e-mailformat.'),
    trad(397, 'login.errorContrasenaCorta',  'login', 'Mínimo 6 caracteres', 'Minimum 6 characters', 'Minst 6 tegn',     'Minimum 6 caractères', 'Mínim 6 caràcters',     'Mindst 6 tegn'),
    trad(398, 'login.errorCredenciales',     'login',
      'Email o contraseña incorrectos.',
      'Incorrect email or password.',
      'Feil e-post eller passord.',
      'E-mail ou mot de passe incorrect.',
      'Correu o contrasenya incorrectes.',
      'Forkert e-mail eller adgangskode.'),
    trad(399, 'login.errorEmailEnUso',       'login',
      'Este email ya tiene una cuenta.',
      'This email is already in use.',
      'Denne e-posten er allerede i bruk.',
      'Cet e-mail est déjà utilisé.',
      'Aquest correu ja té un compte.',
      'Denne e-mail er allerede i brug.'),
    trad(400, 'login.errorContrasenaDebil',  'login',
      'La contraseña debe tener al menos 6 caracteres.',
      'Password must be at least 6 characters.',
      'Passordet må ha minst 6 tegn.',
      'Le mot de passe doit comporter au moins 6 caractères.',
      'La contrasenya ha de tenir almenys 6 caràcters.',
      'Adgangskoden skal være mindst 6 tegn.'),
    trad(401, 'login.errorRed',              'login',
      'Sin conexión. Comprueba tu internet.',
      'No connection. Check your internet.',
      'Ingen tilkobling. Sjekk internett.',
      'Pas de connexion. Vérifiez internet.',
      'Sense connexió. Comprova internet.',
      'Ingen forbindelse. Tjek internettet.'),
    trad(402, 'login.sinCuenta',             'login',
      'Continuar sin cuenta', 'Continue without account', 'Fortsett uten konto', 'Continuer sans compte', 'Continua sense compte', 'Fortsæt uden konto'),
    trad(403, 'login.infoCuenta',            'login',
      'Tu cuenta te permite sincronizar tu ficha médica entre dispositivos y mantener un registro de actividad.',
      'Your account lets you sync your medical record between devices and keep an activity log.',
      'Kontoen din lar deg synkronisere det medisinske kortet mellom enheter og holde en aktivitetslogg.',
      "Votre compte vous permet de synchroniser votre fiche médicale entre appareils et de conserver un journal d'activité.",
      "El teu compte et permet sincronitzar la teva fitxa mèdica entre dispositius i mantenir un registre d'activitat.",
      'Din konto giver dig mulighed for at synkronisere dit medicinske kort mellem enheder og føre en aktivitetslog.'),

    // ── Tamaños de letra extragrandes (404-406) ────────────────────────────
    trad(404, 'config.tamano.gigante', 'config', 'Gigante', 'Huge',    'Gigantisk', 'Géant',   'Gegant', 'Kæmpe'),
    trad(405, 'config.tamano.enorme',  'config', 'Enorme',  'Massive', 'Enorm',     'Énorme',  'Enorme', 'Enorm'),
    trad(406, 'config.tamano.maximo',  'config', 'Máximo',  'Maximum', 'Maks',      'Maximum', 'Màxim',  'Maks'),

    // ── Cuestionario web (407) ─────────────────────────────────────────────
    trad(407, 'cuestionario.pregunta', 'cuestionario',
      'Evalúa la situación', 'Evaluate the situation', 'Vurder situasjonen', 'Évaluez la situation', 'Avalua la situació', 'Vurder situationen'),
  ]);

  console.log('✅ 17 claves (391-407) añadidas/actualizadas en Firestore.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
