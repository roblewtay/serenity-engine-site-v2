FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
ARG ORIGIN
ARG RESEND_API_KEY
ARG CONTACT_EMAIL
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
