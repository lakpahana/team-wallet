pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        TF_VAR_create_deploy_server = 'true'
        APP_NAME = "teamwallet-app-pipeline"
        RELEASE = "1.0.0"
        DOCKER_USER = "lakpahana"
        DOCKER_CREDENTIALS_ID = 'dockerhub' // Docker credentials ID in Jenkins
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'jenkin', url: 'https://github.com/lakpahana/team-wallet'
            }
        }

     
        stage("Build & Push Docker Image backend") {
            steps {
                script {
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        docker_image = docker.build("${IMAGE_NAME}-back")
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }
        }

        stage("Build & Push Docker Image client") {
            steps {
                script {
                    def clientDir = 'client'
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        docker_image = docker.build("${IMAGE_NAME}-client", clientDir)
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }
        }


        stage('Cleanup Artifacts') {
            steps {
                script {
                    sh "docker rmi -f ${IMAGE_NAME}-client:${IMAGE_TAG}"
                    sh "docker rmi -f ${IMAGE_NAME}-client:latest"
                    sh "docker rmi -f ${IMAGE_NAME}-back:${IMAGE_TAG}"
                    sh "docker rmi -f ${IMAGE_NAME}-back:latest"
                }
            }
        }
       

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
