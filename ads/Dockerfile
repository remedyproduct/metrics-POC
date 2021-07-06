FROM node:15.13.0-alpine

WORKDIR /application

COPY package.json package-lock.json ./
RUN npm i

COPY ./ .

CMD [ "npm", "run", "watch" ]
