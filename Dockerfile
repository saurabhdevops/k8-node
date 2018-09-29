FROM node:argon

MAINTAINER Saurabh Oza <saurabh.devops@gmail.com>

# Reduce Log Level
ENV NPM_CONFIG_LOG_LEVEL warn

WORKDIR /opt/app

# Copy package.json first such that the npm install layer does not change when when code other than the package.json changes
COPY package.json .
# Copy README.md to prevent warning about missing README
COPY README.md .
RUN npm install

COPY . .

EXPOSE 8008

ENTRYPOINT ["npm"]
CMD ["start"]