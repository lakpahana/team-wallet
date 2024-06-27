pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        APP_NAME = "teamwallet-app-pipeline"
        RELEASE = "1.0.0"
        DOCKER_USER = "lakpahana"
        DOCKER_PASS = 'dockerhub'
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
                    docker.withRegistry('', DOCKER_PASS) {
                        docker_image = docker.build("${IMAGE_NAME}-back")
                    }

                    docker.withRegistry('', DOCKER_PASS) {
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

                    docker.withRegistry('', DOCKER_PASS) {
                        docker_image = docker.build("${IMAGE_NAME}-client", clientDir)
                    }

                    docker.withRegistry('', DOCKER_PASS) {
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }
        }

        stage('Deploy without Docker Compose') {
            steps {
                script {
                    sh 'docker run -d -p 3002:3002 --name backend lakpahana/teamwallet-app-pipeline-back:latest'
                    sh 'docker run -d -p 3000:3000 --name frontend --link backend:backend lakpahana/teamwallet-app-pipeline-client:latest'
                }
            }
        }
        
        stage('Cleanup Artifacts') {
            steps {
                script {
                    sh "docker rmi ${IMAGE_NAME}-client:${IMAGE_TAG}"
                    sh "docker rmi ${IMAGE_NAME}-client:latest"
                    sh "docker rmi ${IMAGE_NAME}-back:${IMAGE_TAG}"
                    sh "docker rmi ${IMAGE_NAME}-back:latest"
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
