FROM node:16.13-alpine3.14

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 

EXPOSE 3001 

CMD ["npm", "start"]