FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

EXPOSE 3000

# For local development with hot-reloading (if not build and then CMD npm start)
CMD ["npm", "run", "dev"] 