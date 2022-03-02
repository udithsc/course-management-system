FROM node:16.13-alpine3.14 as builder

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV API_URL=http://localhost:3001

EXPOSE 3000

CMD ["npm","start"]