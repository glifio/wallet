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

# Install certbot
RUN wget https://dl.eff.org/certbot-auto && \
    mv certbot-auto /usr/local/bin/certbot-auto && \
    chown root /usr/local/bin/certbot-auto && \
    chmod 0755 /usr/local/bin/certbot-auto

###############
# runtime stage
###############
FROM nginx:1.17.8

# setup nginx
COPY --from=build-env /src/app/build /var/www/react
COPY nginx/conf.d/react.conf /etc/nginx/conf.d/react.conf
RUN rm /etc/nginx/conf.d/default.conf

# Install certbot
COPY --from=build-env /usr/local/bin/certbot-auto /usr/local/bin/certbot-auto
#RUN certbot-auto --nginx -n 
#RUN echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && /usr/local/bin/certbot-auto renew" | sudo tee -a /etc/crontab > /dev/null

EXPOSE 80/tcp
CMD ["nginx", "-g", "daemon off;"]
