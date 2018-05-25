FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json /usr/src/app/
RUN npm install

# COPY Source files and Webpack build
COPY *.js /usr/src/app/
COPY ./src /usr/src/app/src
COPY ./static /usr/src/app/static
COPY ./routes /usr/src/app/routes
RUN npm run build 

EXPOSE 3000
CMD [ "npm", "start" ]
