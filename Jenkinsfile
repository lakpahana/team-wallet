pipeline {
    agent any
    
    stages {
        stage('Build frontend') {
            steps {
                dir('client') {
                    script {
                        docker.build('frontend-image')
                    }
                }
            }
        }
        
        stage('Build backend') {
            steps {
                script {
                    docker.build('backend-image')
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('https://your-docker-registry-url', 'your-docker-registry-credentials') {
                        docker.image('frontend-image').push('latest')
                        docker.image('backend-image').push('latest')
                    }
                }
            }
        }
    }
}
