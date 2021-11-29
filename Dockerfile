FROM node:12-alpine
WORKDIR /usr/library-case/
COPY package.json .
RUN npm install 
COPY . .

