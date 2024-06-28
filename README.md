# Develop

### Prisma

Change .env local with DATABASE_URL

npx prisma migrate develop --name [???]

# Deploy

### Prisma

Change .env production with POSTGRES_URL_NON_POOLING
npx prisma migrate deploy
npx prisma generate dev


# READ MORE:
https://viblo.asia/p/docker-image-in-production-cau-chuyen-1gb-hay-100mb-LzD5dXyE5jY