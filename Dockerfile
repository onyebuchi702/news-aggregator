FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG GUARDIAN_API_KEY
ARG NEWS_API_KEY
ARG NYT_API_KEY
ARG GUARDIAN_API_URL
ARG NEWS_API_URL
ARG NYT_API_URL
ARG NEXT_PUBLIC_BASE_API_URL
ENV GUARDIAN_API_KEY=$GUARDIAN_API_KEY
ENV NEWS_API_KEY=$NEWS_API_KEY
ENV NYT_API_KEY=$NYT_API_KEY
ENV GUARDIAN_API_URL=$GUARDIAN_API_URL
ENV NEWS_API_URL=$NEWS_API_URL
ENV NYT_API_URL=$NYT_API_URL
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL

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

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]