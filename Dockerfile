FROM node:10.15-alpine

# by default docker uses de command COPY as root and also
# needs root permitions to install and update.
# In order to make this all work, the first steps are the
# ones that need root permition and then it changes to
# the user with uid and group 1000 which is a user provided
# by the node docker image which does not have root permitions

# do not open browser when starting react app
ENV BROWSER none

# set the workdir
WORKDIR /usr/src/app

# copy folder
COPY . .

# change the user owner and group of workdir
RUN chown -R 1000:1000 /usr/src/app

# Update apk index.
RUN apk update

# Install packages necessary for dependencies
RUN apk add --no-cache \
    build-base \
    bash git python linux-headers \
    libuv libuv-dev make g++ gcc

# Set the user to use when running this image
USER 1000:1000

# install ui dependencies and link contracts
RUN npm install &>/dev/null && npm run build

# expose ganache-cli port and app port
EXPOSE 3000

# run when docker run ...
CMD ["npm", "run", "live"]
