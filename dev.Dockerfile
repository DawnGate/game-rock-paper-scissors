FROM node:18-alpine AS base

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN npm run prisma:generate
# RUN npm run prisma:migrate

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD npm run prisma:migrate && npm run dev