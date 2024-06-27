# Develop

### Prisma

Change .env local with DATABASE_URL

npx prisma migrate develop --name [???]

# Deploy

### Prisma

Change .env production with POSTGRES_URL_NON_POOLING
npx prisma migrate deploy
