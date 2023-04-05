FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY .env package.json package-lock.json ./
RUN npm install
COPY . .
COPY assets wwwroot prisma ./
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json
COPY --from=builder /usr/src/app/wwwroot ./wwwroot
COPY --from=builder /usr/src/app/assets  ./assets
COPY --from=builder /usr/src/app/.env ./.env
RUN npm install --omit=dev
RUN npm run migrate:production
EXPOSE 3000
CMD ["yarn", "start"]
