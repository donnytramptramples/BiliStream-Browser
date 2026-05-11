FROM node:24-slim AS base

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /workspace

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc tsconfig.base.json tsconfig.json ./

COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/api-server run build

FROM node:24-slim AS runtime

WORKDIR /app

COPY --from=base /workspace/artifacts/api-server/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
