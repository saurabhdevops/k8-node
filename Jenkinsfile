pipeline {
    agent none
    environment {
        DOCKERHUB_USER = 'saurabhdevops'
        IMAGE = 'k8-node'
    }
    stages {
        stage('Build') {
            agent {
                docker { image 'node:argon' }
            }
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            agent {
                docker { image 'node:argon' }
            }
            steps {
                sh 'npm test'
            }
        }
        stage('DockerBuild') {
            agent {
                docker { image 'docker' }
            }
            when {
                branch 'master'
            }
            steps {
                sh 'docker login -u ${DOCKERHUB_USER} -p ${DOCKERHUB_PASSWD}'
                sh 'docker build -t ${DOCKERHUB_USER}/${IMAGE} .'
                sh 'docker push ${DOCKERHUB_USER}/${IMAGE}'
            }
        }
        stage('Deploy') {
            agent {
                docker { image 'saurabhdevops/openshift-client' }
            }
            when {
                branch 'master'
            }
            steps {
                sh 'oc login $OPENSHIFT_SERVER --token=$OPENSHIFT_TOKEN --insecure-skip-tls-verify'
                sh 'oc project k8node'
                sh 'oc process -f okd-deployment.yml -v OPENSHIFT_HOST=${OPENSHIFT_DOMAIN} | oc apply -f -'
                sh 'oc rollout status dc/$IMAGENAME'
            }
        }
    }
}