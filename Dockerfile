# Set the base image
FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json AND package-lock.json
COPY ./package*.json ./

# Install dependencies
# node-gyp requires additional build dependecies using node:alpine
# https://github.com/nodejs/docker-node/issues/282
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm ci \
    && apk del .gyp

# Copy the rest of the code
COPY . .

# Compile the app.
RUN npm run build:prod

# Expose the port
EXPOSE 8080

# Start the app.
CMD [ "node", "www/server.js" ]
