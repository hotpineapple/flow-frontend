FROM node

ARG REACT_APP_RESTAPI_SERVER_URL
ARG REACT_APP_SERVER_URL

WORKDIR /app

COPY package.json .

RUN npm install

RUN echo "SERVER_URL=$SERVER_URL" > .env

COPY . . 

EXPOSE 3000

CMD ["npm", "start"]