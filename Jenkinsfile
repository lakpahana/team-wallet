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

        stage('Log AWS Credentials') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'AMI', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        echo "AWS_ACCESS_KEY_ID: ${env.AWS_ACCESS_KEY_ID}"
                        echo "AWS_SECRET_ACCESS_KEY: ${env.AWS_SECRET_ACCESS_KEY}"
                    }
                }
            }
        }

        stage('Terraform Init') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'AMI', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'AMI', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh 'terraform plan'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'AMI', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Ansible Playbook') {
            steps {
                script {
                    def instanceIp = sh(script: 'terraform output -raw instance_ip', returnStdout: true).trim()
                    if (instanceIp) {
                        writeFile file: 'inventory', text: "[deploy_server]\n${instanceIp} ansible_ssh_private_key_file=~/.ssh/jenkins-sanjula ansible_user=ubuntu"
                        sh 'ansible-playbook -i inventory playbook.yml'
                    } else {
                        echo "No instance created, skipping Ansible playbook execution."
                    }
                }
            }
        }

        // Uncomment and adjust stages as needed for Docker related tasks
        /*
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

        stage('Deploy without Docker Compose') {
            steps {
                script {
                    sh 'docker stop backend || true'
                    sh 'docker rm backend || true'
                    sh 'docker stop frontend || true'
                    sh 'docker rm frontend || true'
                    sh 'docker run -d -p 3002:3002 --name backend ${IMAGE_NAME}-back:latest'
                    sh 'docker run -d -p 3000:3000 --name frontend --link backend:backend ${IMAGE_NAME}-client:latest'
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
        */

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
