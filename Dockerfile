# Set the base image
FROM node:12-alpine

# Define Build arguments.
ARG LOCAL_PACKAGE_DIR=packages/udagram-user-svc

# Create app directory
WORKDIR /usr/udagram-root/packages/app

# Copy package.json AND package-lock.json
COPY $LOCAL_PACKAGE_DIR/package*.json ./

# Install dependencies
# node-gyp requires additional build dependecies using node:alpine
# https://github.com/nodejs/docker-node/issues/282
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm ci \
    && apk del .gyp

# Copy Monorepo root dependencies
COPY tsconfig.base.json /usr/udagram-root/tsconfig.base.json

# Copy the rest of the code
COPY $LOCAL_PACKAGE_DIR/src ./src
COPY $LOCAL_PACKAGE_DIR/tsconfig.json ./tsconfig.json
COPY $LOCAL_PACKAGE_DIR/Dockerfile ./Dockerfile

# Compile the app.
RUN npm run build:prod

# Expose the port
EXPOSE 8080

# Start the app.
CMD [ "node", "www/server.js" ]
