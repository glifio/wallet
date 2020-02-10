#############
# build stage
#############
FROM node:12.14.1 AS build-env

# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

# Install app dependencies
COPY package*.json /src/app/
RUN npm install

# Bundle app source
COPY . /src/app

# Build react app
RUN npm run build

###############
# runtime stage
###############
FROM nginx:1.17.8-alpine

# setup nginx
COPY --from=build-env /src/app/build /var/www/react
COPY nginx/conf.d/react.conf /etc/nginx/conf.d/react.conf
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 5001/tcp
CMD ["nginx", "-g", "daemon off;"]
