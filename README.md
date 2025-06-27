# Ochio Club Monorepo

![Typing Animation](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&duration=4000&pause=1000&color=F70000&center=true&vCenter=true&width=435&lines=Ochio+Club+Cultura+de+Jaen)

Monorepo con todos los componentes de **Ochio Club**: frontend, backend, infra y documentación, organizado para maximizar productividad y colaboración interna.

---

## 📋 Tabla de contenidos

- [Descripción](#descripción)
- [Características principales](#características-principales)
- [Tech Stack](#tech-stack)
- [Requisitos](#requisitos)
- [Instalación & Primeros pasos](#instalación--primeros-pasos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Convenciones de código](#convenciones-de-código)
- [Scripts disponibles](#scripts-disponibles)
- [Conexión con Supabase](#conexión-con-supabase)
- [Ejemplos de llamadas a la API](#ejemplos-de-llamadas-a-la-api)
- [Despliegue](#despliegue)
- [Roadmap & Fases](#roadmap--fases)
- [Documentación & ADR](#documentación--adr)
- [Contacto y Acceso](#contacto-y-acceso)
- [Licencia](#licencia)

---

## 📖 Descripción

Ochio Club es una plataforma social gamificada con gestión de usuarios, clubes, eventos, chat en tiempo real y panel administrativo.  
Este monorepo, gestionado con **pnpm**, contiene:

- **Frontend**: Next.js / React + Tailwind CSS
- **Backend**: Node.js / Express + Supabase
- **Infra local**: Docker Compose
- **Documentación**: OpenAPI, ADRs, diagramas

---

## 🚀 Características principales

- Registro, login y gestión de perfiles
- Creación y gestión de clubes y eventos
- Gamificación: puntos, niveles y badges
- Chat y notificaciones en tiempo real (WebSockets)
- Panel admin con métricas y reportes
- CI/CD con preview deploys automáticos

---

## 🛠 Tech Stack

| Capa             | Tecnología                                  |
| ---------------- | ------------------------------------------- |
| Frontend         | Next.js • React • TypeScript • Tailwind CSS |
| Backend/API      | Node.js • Express • TypeScript • Supabase   |
| Monorepo         | pnpm + Workspaces                           |
| Contenedores     | Docker • Docker Compose                     |
| Testing          | Vitest • Supertest                          |
| Infraestructura  | (pendiente) Terraform / AWS CDK             |
| Observabilidad   | OpenTelemetry • Datadog / CloudWatch        |
| Linter & Formato | ESLint • Prettier • Husky • commitlint      |

---

## 🔧 Requisitos

- Node.js ≥ 16
- pnpm ≥ 7 (o npm/yarn)
- Docker & Docker Compose
- Cuenta de Supabase

---

## ⚡ Instalación & Primeros pasos

1. Clonar el repo
   ```bash
   git clone https://github.com/ochio-club/ochio-club-monorepo.git
   cd ochio-club-monorepo
   Instalar dependencias
   ```

bash
Copiar
Editar
pnpm install
Configurar variables de entorno

bash
Copiar
Editar
cp .env.example apps/api/.env
cp .env.example apps/frontend/.env
Rellenar SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, etc.

Levantar servicios con Docker

bash
Copiar
Editar
docker-compose up --build
Abrir en el navegador

Frontend: http://localhost:3000

API (Swagger UI): http://localhost:4000

📁 Estructura del proyecto

```text
/
├─ .copilot.yml # Config de GitHub Copilot Agent
├─ .vscode/ # Ajustes y recomendaciones VS Code
├─ docker-compose.yml # Orquestación local
├─ openapi.yaml # Spec OpenAPI
├─ docs/
│ ├─ adr/ # Architecture Decision Records
│ └─ diagramas/ # Diagramas C4 / ER
├─ packages/
│ ├─ ui/ # Componentes UI compartidos
│ └─ hooks/ # React hooks compartidos
├─ apps/
│ ├─ frontend/ # Next.js / React
│ └─ api/ # Express + Supabase
└─ infra/ # (futuro) Terraform / CDK
```

📐 Convenciones de código
Ramas Git: `feature/`, `fix/`, `chore/`

Commits: Conventional Commits (`feat:`, `fix:`, `docs:`…)

Prettier & ESLint: ajustes en `.eslintrc`, `.prettierrc`

Husky & lint-staged: pre-commit

TypeScript: modo estricto en `tsconfig.json`

Validación: Zod para nuevos endpoints

💻 Scripts disponibles
Backend (`apps/api`)

```bash
pnpm --filter api dev # modo desarrollo
pnpm --filter api build # compilar TypeScript
pnpm --filter api start # producción
pnpm --filter api test # pruebas unitarias
pnpm --filter api coverage # coverage report
```

Frontend (`apps/frontend`)

```bash
pnpm --filter frontend dev
pnpm --filter frontend build
pnpm --filter frontend start
```

Generales

```bash
docker-compose up
docker-compose down
```

🔗 Conexión con Supabase
En `apps/api/.env`:

```env
SUPABASE_URL=<tu-url-de-supabase>
SUPABASE_KEY=<tu-clave-de-supabase>
JWT_SECRET=<tu-secreto-jwt>
```

El backend usa Supabase Auth y Postgres gestionado.

📡 Ejemplos de llamadas a la API
Autenticación: `POST /auth/login`
Request

```json
{ "email": "user@example.com", "password": "secret" }
```

Response

```json
{ "token": "jwt-token" }
```

Obtener productos: `GET /products`
Headers

```
Authorization: Bearer jwt-token
```

Response

```json
[
  { "id": 1, "name": "Prod 1", "price": 100 },
  { "id": 2, "name": "Prod 2", "price": 200 }
]
```

🚢 Despliegue
Backend

```bash
docker build -t ochio-backend apps/api
docker run -p 4000:4000 ochio-backend
```

Frontend

```bash
docker build -t ochio-frontend apps/frontend
docker run -p 3000:3000 ochio-frontend
```

🛣 Roadmap & Fases
Fase 0 – Auditoría & ADR

Fase 1 – Frontend SSR & UI/UX

Fase 2 – Backend Modular & APIs

Fase 3 – Observabilidad & Seguridad

Fase 4 – Gamificación y WebSockets

Fase 5 – QA, Testing & Go-Live

Fase 6 – Infraestructura Extendida

Fase 7 – Documentación & Handover

(Ver `docs/adr/` para detalles)

📚 Documentación & ADR
ADRs: `docs/adr/`

Diagramas: `docs/diagramas/`

Spec OpenAPI: `openapi.yaml`

📞 Contacto y Acceso
Este repositorio es privado y de consulta interna.
Para consultas de acceso, contacta con:

Neil Muñoz — info@ochioclub.com

📝 Licencia
Este proyecto se distribuye bajo la Apache License 2.0.
Consulta el archivo `LICENSE` para más detalles.
