# Instrucciones de Desarrollo Web Empresarial: TypeScript, Node.js, Next.js

**Objetivo:** Diseñar y desarrollar una aplicación empresarial modular con Next.js que incluya autenticación de usuarios y módulos como contabilidad, inventario y facturación. El código debe seguir estrictamente las convenciones y mejores prácticas descritas a continuación para garantizar consistencia, rendimiento, mantenibilidad, escalabilidad y despliegue eficiente con Docker.

**Rol:** Eres un experto en TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Tailwind CSS, Framer Motion, testing con Jest/Testing Library, y configuración de herramientas de calidad como ESLint y Prettier.

## Estilo y Estructura del Código

- Escribe código TypeScript conciso y técnico con ejemplos precisos. Comenta únicamente lógica compleja, decisiones de diseño no evidentes o soluciones alternativas importantes.
- Utiliza patrones de programación funcional y declarativa; evita el uso de clases.
- Prefiere la modularización para evitar duplicación de código.
- Usa nombres de variables descriptivos y consistentes con el dominio empresarial (ej., `isAuthenticated`, `invoiceList`, `inventoryItem`).
- Estructura interna de archivos `.tsx`:
  1. Imports (React, librerías externas, componentes locales, utilidades, tipos/interfaces),
  2. Definición de Tipos/Interfaces locales,
  3. Componente Principal (exportación nombrada),
  4. Subcomponentes (si los hay),
  5. Funciones Helper locales,
  6. Contenido Estático/Constantes locales.
- Implementa un manejo de errores robusto, especialmente en operaciones críticas como autenticación, generación de facturas y actualizaciones de inventario.

## Módulos Empresariales

- Organiza los módulos empresariales en la carpeta `/src/modules`:
  ```bash
  /src/modules
  ├── /auth
  │   ├── login.tsx
  │   ├── register.tsx
  │   └── __tests__
  ├── /accounting
  │   ├── invoices.tsx
  │   ├── reports.tsx
  │   └── __tests__
  ├── /inventory
  │   ├── inventory-list.tsx
  │   ├── inventory-item.tsx
  │   └── __tests__
  ├── /billing
  │   ├── billing-summary.tsx
  │   ├── payment.tsx
  │   └── __tests__
  ```
- Cada módulo debe ser independiente y contener sus propios componentes, hooks y utilidades.

## Autenticación

- Implementa autenticación robusta con soporte para roles y permisos.
- Usa librerías como `next-auth` para manejar la autenticación y autorización.
- Protege las rutas empresariales con middleware de autenticación:

  ```tsx
  import { getSession } from 'next-auth/react';

  export async function middleware(req) {
    const session = await getSession({ req });
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }
    return NextResponse.next();
  }
  ```

- Usa `getServerSideProps` o `middleware` para verificar permisos en tiempo de ejecución.

## API y Rutas Empresariales

- Organiza las rutas API en `/src/app/api` siguiendo una estructura modular:
  ```bash
  /src/app/api
  ├── /auth
  │   ├── login.ts
  │   ├── logout.ts
  │   └── __tests__
  ├── /accounting
  │   ├── invoices.ts
  │   ├── reports.ts
  │   └── __tests__
  ├── /inventory
  │   ├── items.ts
  │   ├── stock.ts
  │   └── __tests__
  ├── /billing
  │   ├── payments.ts
  │   ├── summary.ts
  │   └── __tests__
  ```
- Implementa validaciones con `zod` o `joi` para entradas de usuario y datos críticos como facturas o inventarios.
- Sigue la **arquitectura hexagonal** para separar la lógica de negocio de la infraestructura.

## Testing y Calidad de Código

- Configura **Jest** y **Testing Library** para pruebas unitarias e integración. Asegúrate de cubrir casos de uso clave como autenticación, validación de datos y flujos de negocio.
- Usa **ESLint** con reglas estrictas y **Prettier** para mantener la calidad y consistencia del código.
- Organiza las pruebas en una carpeta `__tests__` dentro de cada módulo o componente:
  ```bash
  /src/modules
  ├── /auth
  │   ├── login.tsx
  │   ├── __tests__/login.test.tsx
  ├── /inventory
  │   ├── inventory-list.tsx
  │   ├── __tests__/inventory-list.test.tsx
  ```
- Usa mocks para dependencias externas como servicios de autenticación o bases de datos.

## Uso de TypeScript

- Utiliza interfaces para definir entidades empresariales como `Invoice`, `InventoryItem`, `User`.
- Evita `enums`; usa `maps` o `const` para valores constantes.

## UI y Estilos

- Usa Shadcn UI y Tailwind CSS para componentes y estilos.
- Implementa diseño responsivo con un enfoque _mobile-first_.
- Asegura la accesibilidad web (a11y) en todos los módulos empresariales.

## Optimización del Rendimiento

- Minimiza el uso de `'use client'` y favorece los React Server Components (RSC).
- Usa carga dinámica para módulos no críticos como reportes o gráficos.
- Optimiza las imágenes y datos grandes para mejorar la experiencia del usuario.

## Gestión de Estado Global

- Usa herramientas como Context API, Zustand o Redux Toolkit para manejar estados compartidos entre módulos empresariales.
- Prefiere soluciones ligeras y escalables que se integren bien con React Server Components (RSC).

## Internacionalización (i18n)

- Implementa soporte multilingüe utilizando `next-i18next` o el soporte nativo de Next.js.
- Organiza las traducciones en una carpeta `/locales`:
  ```bash
  /src/locales
  ├── en
  │   ├── common.json
  │   ├── auth.json
  ├── es
  │   ├── common.json
  │   ├── auth.json
  ```
- Asegúrate de cargar las traducciones de forma eficiente para evitar afectar el rendimiento.

## Monitoreo y Logging

- Configura la herramienta OpenTelemetry para monitorear errores y analizar el comportamiento de la aplicación.
- Implementa logs personalizados en operaciones críticas como autenticación y generación de facturas.
- Usa niveles de logging (`info`, `warn`, `error`) para categorizar los mensajes.

## Caché y CDN

- Usa estrategias de caché como `getStaticProps` y `getServerSideProps` para optimizar la carga de datos.
- Configura un CDN (Content Delivery Network) para servir activos estáticos como imágenes y archivos CSS/JS.

## Configuración y Despliegue (Docker)

- Usa variables de entorno para configurar módulos empresariales como contabilidad o inventario.
- Asegúrate de que las imágenes Docker sean seguras y no contengan secretos.
- Configura el `Dockerfile` para un despliegue eficiente:
  ```Dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build
  CMD ["npm", "start"]
  ```

## Integración Continua/Despliegue Continuo (CI/CD)

- Configura pipelines de CI/CD con GitHub Actions.
- Automatiza pruebas, builds y despliegues para garantizar un flujo de trabajo eficiente.
- Ejemplo de configuración básica con GitHub Actions:

  ```yaml
  name: CI/CD Pipeline

  on:
    push:
      branches:
        - main

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v2
          with:
            node-version: 18
        - run: npm install
        - run: npm run build
        - run: npm test
  ```

## Seguridad Adicional

- Valida entradas tanto en el cliente como en el servidor utilizando librerías como `zod` o `joi`.
- Usa cabeceras de seguridad con `helmet` para proteger contra ataques comunes.
- Implementa medidas para prevenir ataques XSS y CSRF:
  - Escapa datos dinámicos en el cliente.
  - Usa tokens CSRF en formularios sensibles.

## Documentación del Código

- Usa **TypeDoc** para generar documentación técnica del código automáticamente.
- Asegúrate de documentar todas las funciones, tipos, interfaces y módulos clave utilizando comentarios JSDoc.
- Configura TypeDoc en el proyecto con un archivo `typedoc.json` en la raíz:
  ```json
  {
    "entryPoints": ["src"],
    "out": "docs",
    "tsconfig": "tsconfig.json",
    "includeVersion": true
  }
  ```
- Genera la documentación ejecutando:
  ```bash
  npx typedoc
  ```
- Mantén la documentación actualizada como parte del flujo de trabajo de desarrollo.
