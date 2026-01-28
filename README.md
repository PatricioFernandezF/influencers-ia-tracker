# Influencers IA Tracker

Plataforma para gestionar influencers de IA con seguimiento de posts, valoraciones y filtrado por redes sociales.

## Características

- CRUD de influencers IA
- Múltiples redes sociales por influencer (YouTube, Twitter, Blog)
- Un influencer puede tener varias cuentas de la misma plataforma
- Seguimiento de últimos posts
- Sistema de valoración (1-5 estrellas)
- Filtrado por red social
- Búsqueda en tiempo real

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones (requiere PostgreSQL)
npx prisma migrate dev

# Iniciar backend
npm run server:dev

# Iniciar frontend (otra terminal)
npm run dev
```

## Docker

```bash
# Construir y ejecutar
docker-compose up --build
```

## Variables de Entorno

### Backend
- `PORT`: Puerto del servidor (default: 3001)
- `DATABASE_URL`: URL de conexión a PostgreSQL

### Frontend
- `VITE_API_URL`: URL del backend API

## Puertos (Docker)

- Frontend: 4892
- Backend: 4891
- PostgreSQL: 4893
