FROM node:7.5.0

WORKDIR /app

RUN npm install nodemon -g

COPY ./package.json /app/package.json
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
