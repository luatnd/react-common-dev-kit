# Copy this from https://github.com/ant-design/react-starter-kit/blob/master/Dockerfile

FROM node:7.9.0-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./build/package.json .
COPY ./build/yarn.lock .

# Install Node.js dependencies
RUN yarn install --production --no-progress

# Copy application files
COPY ./build .

CMD [ "node", "server.js" ]