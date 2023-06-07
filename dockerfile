FROM node:14.17.0

RUN node --version
RUN npm --version

# Create app directory
WORKDIR /srv/api/

# Bundle app source

COPY package*.json /srv/api/
RUN npm install
COPY . /srv/api/

# Confirm the working directory

RUN ls -ltr

RUN npm run build
EXPOSE 8080

CMD [ "sh", "-c", "npm start" ]