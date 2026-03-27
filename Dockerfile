FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV PORT=3010

RUN npm run build

EXPOSE 3010

CMD ["npm", "run", "start"]
