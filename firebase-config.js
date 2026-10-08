// =====================================================================
//  Configuración de Firebase para Cuotas Compartidas
// =====================================================================
//
//  1. En la consola de Firebase, entra a ⚙ Configuración del proyecto
//     → General → Tus apps → tu app web (</>).
//  2. Copia el bloque que empieza con  const firebaseConfig = {
//     y termina con  };
//  3. Pégalo aquí abajo, reemplazando el bloque de ejemplo completo.
//
//  Estos datos no son secretos: identifican tu proyecto, pero no dan
//  acceso a tus compras. Lo que protege tu información son las reglas
//  de seguridad de Firestore (solo tu cuenta puede leer tus datos).
// =====================================================================

const firebaseConfig = {
  apiKey: "PEGA_AQUI",
  authDomain: "PEGA_AQUI",
  projectId: "PEGA_AQUI",
  storageBucket: "PEGA_AQUI",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI"
};

// No cambies esta línea:
window.FIREBASE_CONFIG = firebaseConfig;
