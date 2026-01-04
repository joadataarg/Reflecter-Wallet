# Open The Doorz (OTD) - Arquitectura del Sistema

## Resumen Ejecutivo

Open The Doorz es una plataforma de gestión de aplicaciones blockchain donde cada organización es completamente aislada y orquesta su propia API. La arquitectura está diseñada para soportar múltiples organizaciones, cada una con su propio conjunto de aplicaciones (apps), credenciales, y entornos (Developer/Production).

---

## 1. Estructura de Organizaciones

### 1.1 Concepto General

```
┌─────────────────────────────────────────────────────────────┐
│                    Open The Doorz Platform                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐    ┌──────────────────────┐       │
│  │   Organización A     │    │   Organización B     │       │
│  │   (Aislada)          │    │   (Aislada)          │       │
│  │                      │    │                      │       │
│  │  ┌────────────────┐  │    │  ┌────────────────┐  │       │
│  │  │   App 1        │  │    │  │   App 1        │  │       │
│  │  │  (Developer)   │  │    │  │  (Developer)   │  │       │
│  │  │  (Production)  │  │    │  │  (Production)  │  │       │
│  │  └────────────────┘  │    │  └────────────────┘  │       │
│  │                      │    │                      │       │
│  │  ┌────────────────┐  │    │  ┌────────────────┐  │       │
│  │  │   App 2        │  │    │  │   App 2        │  │       │
│  │  │  (Developer)   │  │    │  │  (Developer)   │  │       │
│  │  │  (Production)  │  │    │  │  (Production)  │  │       │
│  │  └────────────────┘  │    │  └────────────────┘  │       │
│  │                      │    │                      │       │
│  │  [API Endpoints]     │    │  [API Endpoints]     │       │
│  │  [Credenciales]      │    │  [Credenciales]      │       │
│  │  [Webhook Secrets]   │    │  [Webhook Secrets]   │       │
│  │                      │    │                      │       │
│  └──────────────────────┘    └──────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Características de Organización

Cada organización tiene:

- **ID Único**: Identificador único en el sistema
- **Slug**: URL-safe identifier (ej: `acme-corp`)
- **Nombre**: Nombre legible (ej: "Acme Corporation")
- **Propietario**: Usuario que creó la organización
- **Miembros**: Lista de usuarios con roles (OWNER, ADMIN, MEMBER)
- **Rol del Usuario**: OWNER, ADMIN o MEMBER
- **Aislamiento Total**: Datos, APIs, y credenciales NO son accesibles desde otras organizaciones

### 1.3 Modelo de Datos (Propuesto)

```typescript
interface Organization {
  id: string;                    // UUID
  slug: string;                  // URL-safe: acme-corp
  name: string;                  // "Acme Corporation"
  ownerId: string;               // UID del propietario (Firebase)
  createdAt: Date;
  updatedAt: Date;
  
  // Settings
  settings: {
    timezone: string;
    defaultNetwork: 'MAINNET' | 'SEPOLIA';
    apiRateLimit: number;
  };
  
  // Metadata
  metadata: {
    description?: string;
    website?: string;
    logo?: string;
  };
}

interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: Date;
}

interface App {
  id: string;
  organizationId: string;        // Referencia a la organización
  name: string;
  slug: string;                  // ej: app-slug
  description?: string;
  
  // Entornos
  environments: {
    developer: AppEnvironment;
    production: AppEnvironment;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deployedAt?: Date;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
}

interface AppEnvironment {
  id: string;
  type: 'developer' | 'production';
  
  // Credenciales
  credentials: {
    apiKey: string;              // API Key único
    apiSecret: string;            // API Secret (nunca se devuelve)
    webhookSecret: string;         // Para validar webhooks
  };
  
  // Endpoints
  endpoints: {
    baseUrl: string;             // ej: https://api.otd.com/org/{orgId}/app/{appId}
    webhookUrl?: string;
  };
  
  // Metadata
  createdAt: Date;
  lastRotatedAt?: Date;
}
```

---

## 2. Sistema de APIs por Organización

### 2.1 Arquitectura de API Gateway

```
┌──────────────────────────────────────────────────────────────┐
│                     API Gateway                               │
│              (Next.js /api/v1 routes)                        │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Request: POST /api/v1/org/{orgId}/apps                      │
│           GET  /api/v1/org/{orgId}/apps/{appId}              │
│           POST /api/v1/org/{orgId}/apps/{appId}/deploy      │
│                                                                │
│  ↓                                                             │
│  [Middleware]                                                 │
│  - Autenticación (Firebase + API Keys)                       │
│  - Validación de Organización                                 │
│  - Rate Limiting por org                                      │
│  - Logging & Monitoring                                       │
│                                                                │
│  ↓                                                             │
│  [Request Router]                                             │
│  - Aislar por orgId                                           │
│  - Enrutar a controlador apropiado                           │
│                                                                │
│  ↓                                                             │
│  [Org Service Layer]                                          │
│  - Buscar organización                                        │
│  - Validar permiso del usuario                               │
│  - Ejecutar lógica de negocio                                │
│                                                                │
│  ↓                                                             │
│  [Database Query]                                             │
│  WHERE organizationId = {orgId}                              │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Rutas API Propuestas

```
/api/v1/
├── /auth
│   └── /login
│   └── /signup
│   └── /logout
│
├── /org/{orgId}
│   ├── /profile
│   │   ├── GET    - Obtener detalles de org
│   │   ├── PATCH  - Actualizar settings
│   │   └── DELETE - Eliminar organización
│   │
│   ├── /members
│   │   ├── GET         - Listar miembros
│   │   ├── POST        - Invitar miembro
│   │   ├── /{userId}
│   │   │   ├── PATCH   - Actualizar rol
│   │   │   └── DELETE  - Eliminar miembro
│   │
│   ├── /apps
│   │   ├── GET                    - Listar apps
│   │   ├── POST                   - Crear app
│   │   ├── /{appId}
│   │   │   ├── GET                - Detalles de app
│   │   │   ├── PATCH              - Actualizar app
│   │   │   ├── DELETE             - Eliminar app
│   │   │   ├── /deploy
│   │   │   │   ├── POST           - Deploy a dev/prod
│   │   │   │   └── GET            - Status de deploy
│   │   │   ├── /credentials
│   │   │   │   ├── GET            - Ver credenciales
│   │   │   │   ├── /rotate
│   │   │   │   │   └── POST       - Rotar API keys
│   │   │   ├── /webhooks
│   │   │   │   ├── GET            - Listar webhooks
│   │   │   │   ├── POST           - Crear webhook
│   │   │   │   ├── /{webhookId}
│   │   │   │   │   ├── PATCH      - Actualizar
│   │   │   │   │   └── DELETE     - Eliminar
│   │   │   ├── /logs
│   │   │   │   └── GET            - Logs de staging/prod
│   │   │   ├── /metrics
│   │   │   │   └── GET            - Métricas de uso
│   │
│   ├── /integrations
│   │   ├── /lending
│   │   │   ├── GET    - Status
│   │   │   └── POST   - Configurar
│   │   ├── /bots-trading
│   │   │   ├── GET    - Status
│   │   │   └── POST   - Configurar
│   │
│   └── /billing
│       ├── GET        - Estado de cuenta
│       ├── /invoices
│       └── /usage
```

### 2.3 Middleware de Seguridad

```typescript
// middleware/orgAuth.ts
import { NextRequest, NextResponse } from 'next/server';

export async function validateOrgAccess(
  request: NextRequest,
  orgId: string,
  userId: string
) {
  // 1. Verificar que la organización existe
  const org = await db.organization.findUnique({
    where: { id: orgId }
  });
  
  if (!org) {
    return NextResponse.json(
      { error: 'Organization not found' },
      { status: 404 }
    );
  }
  
  // 2. Verificar que el usuario tiene acceso a la organización
  const member = await db.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId: userId
    }
  });
  
  if (!member) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }
  
  // 3. Verificar permisos específicos según el rol
  if (member.role === 'MEMBER' && request.method !== 'GET') {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  // 4. Pasar a la siguiente función
  return null;
}
```

---

## 3. Gestión de Credenciales

### 3.1 Tipos de Credenciales

Cada app en cada entorno (Developer/Production) tiene:

```typescript
interface Credentials {
  apiKey: string;           // Público, identifica la app
  apiSecret: string;         // Privado, se usa para HMAC
  webhookSecret: string;     // Se usa para validar webhooks
}

// Ejemplo de credencial
{
  apiKey: "otd_dev_abc123xyz789...",
  apiSecret: "sk_dev_***[NUNCA SE MUESTRA EN UI]***",
  webhookSecret: "whsec_dev_...***..."
}
```

### 3.2 Seguridad de Credenciales

- **API Keys**: Se guardan hasheadas en BD, nunca se devuelven en APIs
- **API Secrets**: Se muestran UNA SOLA VEZ al crear o rotar
- **Webhook Secrets**: Se usan para validar integridad de webhooks
- **Rotación**: Se pueden rotar sin afectar la app actual
- **Namespace por entorno**: Dev keys diferenciadas de Prod keys

```typescript
// Ejemplo: Rotar credenciales
POST /api/v1/org/{orgId}/apps/{appId}/credentials/rotate
{
  environment: "developer" | "production"
}

Response:
{
  apiKey: "otd_dev_new...",
  apiSecret: "sk_dev_***NUEVA***",  // Solo se muestra aquí
  webhookSecret: "whsec_dev_...",
  note: "Credenciales anteriores dejarán de funcionar en 30 días"
}
```

---

## 4. Flujo de Despliegue de Apps

### 4.1 Ciclo de vida de una App

```
┌─────────────────────────────────────────────────────────────┐
│                  CREAR APP (Empty State)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /api/v1/org/{orgId}/apps                              │
│  {                                                            │
│    name: "Mi App",                                           │
│    slug: "mi-app",                                           │
│    description: "..."                                        │
│  }                                                            │
│                                                               │
│  ↓ Crear dos entornos automáticamente                       │
│                                                               │
│  App {                                                        │
│    status: 'DRAFT',                                          │
│    environments: {                                           │
│      developer: { credentials: {...} },                     │
│      production: { credentials: {...} }                     │
│    }                                                          │
│  }                                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               DESPLEGAR EN DEVELOPMENT (Staging)             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /api/v1/org/{orgId}/apps/{appId}/deploy              │
│  {                                                            │
│    environment: "developer",                                 │
│    source: "NEXT.JS" // Por ahora solo Next.js               │
│  }                                                            │
│                                                               │
│  ↓ Validar código (ESLint, TypeScript)                      │
│  ↓ Build Docker image                                       │
│  ↓ Deploy a container registry                              │
│  ↓ Actualizar endpoint en staging                           │
│                                                               │
│  Response: {                                                 │
│    status: "DEPLOYED",                                       │
│    deploymentId: "dep_xyz...",                              │
│    url: "https://api.otd.com/dev/{orgId}/{appId}",         │
│    logs: "https://otd.com/logs/{deploymentId}"             │
│  }                                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          PROMOVER A PRODUCTION (Go Live)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /api/v1/org/{orgId}/apps/{appId}/promote             │
│  {                                                            │
│    fromEnvironment: "developer",                             │
│    toEnvironment: "production"                               │
│  }                                                            │
│                                                               │
│  ↓ Copiar deployment de dev a prod                          │
│  ↓ Actualizar DNS/routing                                   │
│  ↓ Ejecutar smoke tests                                     │
│                                                               │
│  Response: {                                                 │
│    status: "ACTIVE",                                         │
│    productionUrl: "https://api.otd.com/prod/{orgId}/{appId}",
│    deploymentId: "dep_prod_...",                            │
│  }                                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Proceso de Deploy en Código

```typescript
// app/api/v1/org/[orgId]/apps/[appId]/deploy/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { validateOrgAccess } from '@/middleware/orgAuth';

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string; appId: string } }
) {
  const { orgId, appId } = params;
  const { environment } = await request.json();
  
  // 1. Validar acceso a organización
  const authError = await validateOrgAccess(request, orgId, userId);
  if (authError) return authError;
  
  // 2. Validar que la app pertenece a esta organización
  const app = await db.app.findFirst({
    where: {
      id: appId,
      organizationId: orgId
    }
  });
  
  if (!app) {
    return NextResponse.json(
      { error: 'App not found in this organization' },
      { status: 404 }
    );
  }
  
  // 3. Iniciar proceso de deploy
  const deployment = await deployAppEnvironment({
    appId,
    organizationId: orgId,
    environment,
    source: 'NEXT.JS'
  });
  
  // 4. Retornar información de deploy
  return NextResponse.json({
    deploymentId: deployment.id,
    status: deployment.status,
    url: `https://api.otd.com/${environment}/${orgId}/${appId}`,
    logs: `/logs/${deployment.id}`
  });
}
```

---

## 5. Sistema de Billetera (Wallet)

### 5.1 Componentes de Wallet

La billetera integrada en OTD tiene:

- **Home**: Botones para Send, Receive, Apps, Lending, Bots Trading
- **Assets**: Mostrar balances de ETH, STRK, USDC
- **Positions**: Posiciones de lending (under dev)
- **History**: Historial de transacciones in/out (en producción)
- **Apps**: Mostrar aplicaciones desplegadas
- **Lending**: Integración con Vesu Protocol
- **Bots Trading**: Estrategias de trading automatizado (under dev)
- **Settings**: Network, Profile, Staging Logs, Session, Logout

### 5.2 Flujo de Integración

```
┌─────────────────────────────────────────────────┐
│      Usuario abre Wallet                        │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. ¿Autenticado en Firebase?                  │
│     ├─ NO: Mostrar Login/Register              │
│     └─ SÍ: Continuar                           │
│                                                  │
│  2. ¿Billetera conectada?                      │
│     ├─ NO: Mostrar Create/Restore              │
│     └─ SÍ: Mostrar dashboard                   │
│                                                  │
│  3. Cargar datos en paralelo:                  │
│     ├─ useFetchWallet()                        │
│     ├─ useTokenPrices()                        │
│     ├─ useTokenBalance('ETH')                  │
│     ├─ useTokenBalance('STRK')                 │
│     ├─ useTokenBalance('USDC')                 │
│     └─ useNetwork()                            │
│                                                  │
│  4. Mostrar estado con balances reales         │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 6. Implementación por Fases

### Fase 1 (Actual - Wallet & Apps View)
- [x] Wallet integrada con Send/Receive/Apps/Lending/Bots
- [x] Vista de Assets/Positions/History
- [x] Settings con Staging Logs
- [x] Estructura de organizaciones en UI

### Fase 2 (Próxima - API Orquestación)
- [ ] Implementar rutas API por organización
- [ ] Middleware de seguridad
- [ ] Gestión de credenciales
- [ ] Sistema de deploy

### Fase 3 (Post-API)
- [ ] Sistema de facturación
- [ ] Webhooks
- [ ] Rate limiting por org
- [ ] Monitoring & Analytics

### Fase 4 (Características Avanzadas)
- [ ] Multi-organización en dashboard
- [ ] Invitación de miembros
- [ ] Roles y permisos granulares
- [ ] Logs de auditoría

---

## 7. Notas Importantes

### 7.1 Decisiones Arquitectónicas

1. **Aislamiento Total**: Cada organización es un silo completo. Las queries siempre incluyen `WHERE organizationId = {orgId}`

2. **API Keys por Entorno**: Developer y Production tienen credenciales separadas, permitiendo testing sin afectar producción

3. **Next.js API Routes**: La orquestación de APIs se hace a través de routes de Next.js para mantener el stack unificado

4. **Database Design**: 
   - Índices on `(organizationId, id)` para queries rápidas
   - Restricciones de foreign key para mantener integridad

### 7.2 Seguridad

- **No mostrar secrets en APIs**: Los API Secrets solo se muestran al crear/rotar
- **HMAC para webhooks**: Validar integridad con webhook secrets
- **Rate limiting**: Por organización, no por usuario
- **Auditoría**: Loguear todas las operaciones administrativas

### 7.3 Escalabilidad

- **Preparado para multi-region**: Las credenciales incluyen prefijo de región
- **Database sharding**: Poder particionar por organizationId en el futuro
- **Caching por org**: Redis cache aislado por organizationId

---

## 8. Próximos Pasos Recomendados

1. **Implementar API Gateway**: Crear estructuras base en `/api/v1/org/[orgId]/`
2. **Middleware de Auth**: Validar acceso a org en cada request
3. **Modelos de BD**: Crear tablas para Organization, OrganizationMember, App, AppEnvironment
4. **CLI de Deploy**: Crear herramienta para deployers locales
5. **Dashboard**: Ampliar UI para mostrar Apps y credenciales
