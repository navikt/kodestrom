FROM node:16 AS builder
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm ci --prefer-offline --no-audit

COPY . /usr/src/app

RUN npm run build

# ---- Runner ----
FROM node:16-alpine AS runtime
WORKDIR /usr/src/app

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production \
    TZ=Europe/Oslo

COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/public ./

COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 3000
USER node

CMD ["node", "server.js"]
