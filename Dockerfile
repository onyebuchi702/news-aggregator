FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_GUARDIAN_API_KEY
ARG NEXT_PUBLIC_NEWS_API_KEY
ARG NEXT_PUBLIC_NYT_API_KEY
ENV NEXT_PUBLIC_GUARDIAN_API_KEY=$NEXT_PUBLIC_GUARDIAN_API_KEY
ENV NEXT_PUBLIC_NEWS_API_KEY=$NEXT_PUBLIC_NEWS_API_KEY
ENV NEXT_PUBLIC_NYT_API_KEY=$NEXT_PUBLIC_NYT_API_KEY

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]