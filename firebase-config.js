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
  apiKey: "AIzaSyA6tj7fEtLOxNT5FUCvyXCtlbGdbkcCM2I",
  authDomain: "organizador-de-gastos-6dacc.firebaseapp.com",
  projectId: "organizador-de-gastos-6dacc",
  storageBucket: "organizador-de-gastos-6dacc.firebasestorage.app",
  messagingSenderId: "67659810745",
  appId: "1:67659810745:web:3377060e134be7d7901868"
};

// No cambies esta línea:
window.FIREBASE_CONFIG = firebaseConfig;
