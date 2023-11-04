FROM node

ARG REACT_APP_SERVER_URL

WORKDIR /app

COPY package.json .

RUN npm install

RUN echo "REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL" >> .env

COPY . . 

EXPOSE 3000

CMD ["npm", "start"]