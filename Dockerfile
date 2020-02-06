FROM node:12.14.1

# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

# Install app dependencies
COPY package*.json /src/app/
RUN npm install && \
  npm install -g serve

# Bundle app source
COPY . /src/app

# Build react app
RUN npm run build

EXPOSE 5000

CMD [ "serve", "-s", "build" ]
