# k8-node
Kickstart NodeJS app with CI/CD for k8s

   * This is a simple node js app that displays the app version at the `/version` uri of the app.
   * The purpose of this repo is to demonstrate CI/CD for NodeJS on k8s.

## Run Locally

   * To run this app locally, you will need node js installed on your workstation.
   * Clone this repo and run the below command to run it locally.

```
node app.js
```

   * Once you run this application, you can open your browser and hit http://localhost:8008/version to access your app. This should display the application version of your node js app.

### Run with NPM
   * [NPM](https://www.npmjs.com/) is a default package manager for node.js apps. As a best practice, it is recommended runtime for node.js.
   * This app uses npm as package manager.
   * To run the app with npm, clone the repo and run:

```
npm start
```

### Run with Docker
   * To run this app on k8s, you first need to dockerize the app and create a docker image for your app.
   * [Dockerfile](Dockerfile) is used to configure and build your docker image for the application.
   * Build Docker image using the below command.
   ```
   docker build -t node-k8-app .
   ```
   * Once built successfully, you can run the application locally with the below command
   ```
   docker run -p 8008:8008 --rm node-k8-app
   ```
   * You can access your app at http://localhost:8008/version link in your browser
   * *_Note:_* If you are using Windows version lower than Win10, you might be running docker in a docker-machine. In this case, run `docker-machine ip` to get the IP address of docker machine and access app with URL `http://<docker-machine-ip>:8008/version`
   * You can now tag and push this image to your own registry if needed.
   * I have used [Dockerhub Auto Builds](https://docs.docker.com/docker-hub/builds/) to push image automatically to Dockerhub. You can use this image [saurabhdevops/k8-node](https://hub.docker.com/r/saurabhdevops/k8-node/) directly to run as well.