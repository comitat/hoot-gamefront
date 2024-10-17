# From:
# https://github.com/RomainLanz/romainlanz.com/blob/main/Dockerfile
FROM node:21-alpine3.19 AS base

RUN apk --no-cache add curl git openssh py3-pip make g++ python3
RUN npm install pm2 -g

COPY id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa && \
    ssh-keyscan git.bsn.si >> /root/.ssh/known_hosts

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build --ignore-ts-errors

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
# only if you use sqlite3
RUN mkdir tmp && touch ./tmp/db.sqlite3
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY ecosystem.config.cjs /app/
RUN rm -rf /root/.ssh/
EXPOSE 3333
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
