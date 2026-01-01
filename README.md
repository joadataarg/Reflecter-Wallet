# Vesu Hooks + ChipiPay (Firebase Edition)

Este proyecto integra **Vesu** (protocolo de préstamos) con **ChipiPay** (transacciones gasless) utilizando **Firebase Authentication**.

## Cambios Recientes (Migración Supabase -> Firebase)
Se ha completado la migración total de la autenticación:
- **Autenticación**: Firebase Auth (Email/Password).
- **Base de Datos**: N/A (Usuario gestionado en Firebase).
- **Tokens**: Firebase ID Tokens (JWT) verificados por ChipiPay.

## 🆕 Selector de Red (Nuevo)
Ahora puedes cambiar entre **Mainnet** y **Sepolia Testnet** directamente desde la interfaz:
- El selector de red está en el panel derecho del dashboard
- La configuración se guarda automáticamente en localStorage
- Al cambiar de red, la aplicación se recarga para aplicar la configuración
- **Sepolia**: Para desarrollo y pruebas (usa faucets para obtener tokens gratis)
- **Mainnet**: Red de producción (requiere tokens reales con valor económico)

### Fondos por activo (Starknet)
- **ETH (Sepolia)**: ✅ Tiene faucet → https://starknet-faucet.vercel.app/
- **STRK (Sepolia)**: ✅ Disponible vía faucet → https://starknet-faucet.vercel.app/
- **USDC (Sepolia)**: ⚠️ No hay faucet público estable; usar ETH de faucet o un minter/puente privado.
- **Mainnet (ETH/USDC/STRK)**: No hay faucets. Requiere fondos reales / puente desde L1 o CEX con retiro a Starknet.

### Direcciones de contratos (override por `.env.local`)
El SDK trae defaults para ETH/USDC en Starknet, pero puedes sobreescribirlos sin tocar código:

```bash
# Sepolia
NEXT_PUBLIC_STARKNET_SEPOLIA_ETH=0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
NEXT_PUBLIC_STARKNET_SEPOLIA_USDC=0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
NEXT_PUBLIC_STARKNET_SEPOLIA_STRK=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
NEXT_PUBLIC_STARKNET_SEPOLIA_ETH_VTOKEN=<vToken_eth_testnet>
NEXT_PUBLIC_STARKNET_SEPOLIA_USDC_VTOKEN=<vToken_usdc_testnet>
NEXT_PUBLIC_STARKNET_SEPOLIA_STRK_VTOKEN=<vToken_strk_testnet>

# Mainnet
NEXT_PUBLIC_STARKNET_MAINNET_ETH=0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
NEXT_PUBLIC_STARKNET_MAINNET_USDC=0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
NEXT_PUBLIC_STARKNET_MAINNET_STRK=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
NEXT_PUBLIC_STARKNET_MAINNET_ETH_VTOKEN=<vToken_eth_mainnet>
NEXT_PUBLIC_STARKNET_MAINNET_USDC_VTOKEN=<vToken_usdc_mainnet>
NEXT_PUBLIC_STARKNET_MAINNET_STRK_VTOKEN=<vToken_strk_mainnet>
```

Nota: STRK queda deshabilitado hasta que se definan sus direcciones; las acciones se bloquean si el address es placeholder.

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
# Opcional: URL alpha/sandbox provista por Chipi Pay para pruebas (Sepolia)
# Solicítala a soporte de Chipi Pay si necesitas testnet
# NEXT_PUBLIC_CHIPI_ALPHA_URL=https://alpha.chipipay.com
```

**Nota**: Ya NO necesitas configurar `NEXT_PUBLIC_STARKNET_NETWORK` en el `.env.local`. La red se selecciona desde la UI.

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

### UX sin PIN: Derivación automática de `encryptKey`

La aplicación oculta el PIN al usuario y deriva automáticamente la clave de encriptación de la billetera a partir del UID de Firebase.

- Variable opcional: `NEXT_PUBLIC_ENCRYPT_SALT` para personalizar el salt público usado en la derivación.
- Si no se define, se usa `vesu_default_salt`.

Esta estrategia busca simplicidad de UX. Para entornos con mayores requisitos de seguridad, considera habilitar un PIN/biometría. 

### Red y Entorno (Mainnet vs Sepolia)

El selector de red de la UI controla contratos y enlaces (explorer). La red donde se crea la billetera ChipiPay depende de tu **API Public Key** y/o de `alphaUrl`:

- API Keys de producción → Mainnet.
- API Keys de sandbox/test → Sepolia.
- También puedes apuntar a un backend de pruebas con `NEXT_PUBLIC_CHIPI_ALPHA_URL` (consultar con Chipi Pay).

Tras cambiar las credenciales/URL, reinicia el servidor para aplicar el cambio.
