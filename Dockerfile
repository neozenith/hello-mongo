FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY *.js /usr/src/app/
COPY ./src /usr/src/app/src
COPY ./static /usr/src/app/static

RUN npm install
RUN npm run build 
# COPY . /sr/src/app
EXPOSE 3000
CMD [ "npm", "start" ]
