# k8-node

[![Docker Automated build](https://img.shields.io/docker/automated/saurabhdevops/k8-node.svg?style=flat-square)](https://hub.docker.com/r/saurabhdevops/k8-node/)
[![Docker Pulls](https://img.shields.io/docker/pulls/saurabhdevops/k8-node.svg?style=flat-square)](https://hub.docker.com/r/saurabhdevops/k8-node/)
[![Docker Stars](https://img.shields.io/docker/stars/saurabhdevops/k8-node.svg?style=flat-square)](https://hub.docker.com/r/saurabhdevops/k8-node/)
[![MicroBadger Size](https://img.shields.io/microbadger/image-size/saurabhdevops/k8-node.svg?style=flat-square)](https://hub.docker.com/r/saurabhdevops/k8-node/)

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

### Deploy Manually On OKD
   * [OKD](https://www.okd.io/) is the "Origin Community Distribution" of k8s.
   * To scaleup a local cluster, visit https://github.com/openshift/origin/blob/master/docs/cluster_up_down.md
   * You will need Openshift CLI [oc](https://www.okd.io/download.html#oc-platforms).
   * To deploy this application on okd/openshift cluster, you can use the [Deployment Config](okd-deployment.yml) file with the below command.
   ```
   oc process -f okd-deployment.yml -v OPENSHIFT_HOST=<your_okd_dns> | oc apply -f -
   ```
   * This will deploy the `saurabhdevop/k8-node` image onto your okd cluster.
   * By default, it will create a k8 `Deployment Config`, `service` and `routes`.

### CI / CD
   * We are using [GitLab CI](https://about.gitlab.com/features/gitlab-ci-cd/) as our CI/CD tool here.
   * You will need to install a `Gitlab CI Runner` with [Docker](https://docs.gitlab.com/runner/install/docker.html) or [K8](https://docs.gitlab.com/runner/install/kubernetes.html) executors.
   * You need to tag your runner with `DOCKER` tag or [add your custom tag] in the [Gitlab CI File](.gitlab-ci.yml)