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
   * The same template objects can directly be used with any flavour or type of kuberentes you are using.

### CI / CD
   * We are using [GitLab CI](https://about.gitlab.com/features/gitlab-ci-cd/) as our CI/CD tool here.
   * You will need to install a `Gitlab CI Runner` with [Docker](https://docs.gitlab.com/runner/install/docker.html) or [K8](https://docs.gitlab.com/runner/install/kubernetes.html) executors.
   * You need to tag your runner with `DOCKER` tag or [add your custom tag] in the [Gitlab CI File](.gitlab-ci.yml)
   * You can also use Jenkins for CI / CD by reusing the same concept(build steps in docker slave) with a combination of [jenkins](https://hub.docker.com/_/jenkins/), [jenkins docker slave](https://hub.docker.com/r/jenkinsci/slave/) & [pipeline plugin](https://jenkins.io/doc/book/pipeline/jenkinsfile/)
   * *NOTE:* The [Jenkinsfile](Jenkinsfile) is just indicative of how it can be done with Jenkins and is not completely tested.

### HA & Fault Tolerance:
   * The k8s deployment is designed for high availability and fault tolerance.
   * As you can see [here](okd-deployment.yml#L19), we have configured the k8 deployment to run 3 replicas of the application. We have made it configurable via [NO_OF_REPLICAS](okd-deployment.yml#L104).
   * K8s ensure that there are always 3 healthy pods/containers running of the application.
   * The [readinessProbe](okd-deployment.yml#L44) helps kubernetes identify the health by making http calls to `version` endpoint. If this endpoint fails to respond with `HTTP 2xx` response, kubernetes will automatically evict that pod and replace it with a new one.
   * Even if you terminate one of the pods forcefully, k8 will create a fresh one and always maintain 3 read replicas.
   * Typically in k8 cluster, k8 automatically assigns the pods to different underlying nodes in the cluster. This ensures that even if one of the nodes in cluster is terminated, the other 2 pods will keep serving the requests and k8 will try to self heal and provision the 3rd node again maintaining the defined cluster state of 3 replicas.
   * If k8 is deployed onto AWS using 3 different availability zones, k8s can read the AWS metadata and allocate one pod on a node in each availability zone. This means that even if there is a complete outage on one of the AZs, the app will still be running.

### Rolling upgrade
   * With each change in the docker image, we are triggering a [rollout](.gitlab-ci.yml#L38).
   * This will trigger a rolling deployment as per the parameters mentioned [here](okd-deployment.yml#L25).
   * The k8s will deploy one instance of new version and wait for the `readinessProbe` to pass. Once it passes, ONLY then will it terminate one pod from old deployment. It will then start with the next and so on.
   * We have also mentioned `terminationGracePeriodSeconds` so that if a pod is already serving a request, it has time to finish those before being terminated.
   * This will result in zero-downtime rolling upgrades.