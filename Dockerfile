# Create a virtual environment with all tools installed
FROM node:alpine AS env

#RUN apk add --no-cache wget
# Install/Configure nodejs, npm, yarn
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
# Global Dependencies
RUN npm install -g http-server

# Create app directory
WORKDIR /home/node/app

EXPOSE 8080
CMD [ "http-server" ]
