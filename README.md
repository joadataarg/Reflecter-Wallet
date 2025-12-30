# Vesu Hooks + ChipiPay (Firebase Edition)

Este proyecto integra **Vesu** (protocolo de préstamos) con **ChipiPay** (transacciones gasless) utilizando **Firebase Authentication**.

## Cambios Recientes (Migración Supabase -> Firebase)
Se ha completado la migración total de la autenticación:
- **Autenticación**: Firebase Auth (Email/Password).
- **Base de Datos**: N/A (Usuario gestionado en Firebase).
- **Tokens**: Firebase ID Tokens (JWT) verificados por ChipiPay.

## Configuración Requerida

Para que el proyecto funcione correctamente y desaparezcan los errores 400/401, realiza lo siguiente:

### 1. Variables de Entorno
Crea un archivo `.env.local` con tus credenciales de Firebase:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... resto de variables de Firebase
NEXT_PUBLIC_CHIPI_API_KEY=...
```

### 2. Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Selecciona tu proyecto.
3. Ve a **Authentication** -> **Sign-in method**.
4. Habilita el proveedor **Email/Password**.

### 3. ChipiPay Dashboard (CRITICO)
Para que ChipiPay acepte los tokens de Firebase:
1. Ve al [Dashboard de ChipiPay](https://dashboard.chipipay.com/).
2. En la configuración de **JWT / Auth**:
   - **JWKS Endpoint**: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys`
   - **Issuer (si se pide)**: `https://securetoken.google.com/<TU_PROJECT_ID>`

## Ejecución
```bash
npm install
npm run dev
```
