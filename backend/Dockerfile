FROM node:16.13-alpine3.14

WORKDIR /app
COPY package*.json ./
RUN apk add --update --no-cache openssl1.1-compat
RUN npm install
COPY . . 
RUN npx prisma generate

EXPOSE 3001 

CMD ["npm", "start"]