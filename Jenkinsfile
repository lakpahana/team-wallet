pipeline {
    agent any

    // Define tools to be installed
    tools {
        // Install Node.js tool with a specific version
        nodejs 'nodejs'
    }

    environment {
	        APP_NAME = "teamwallet-app-pipeline"
            RELEASE = "1.0.0"
            DOCKER_USER = "lakpahana"
            DOCKER_PASS = 'dockerhub'
            IMAGE_NAME = "${DOCKER_USER}" + "/" + "${APP_NAME}"
            IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
      steps {
        // Check out the repository from GitHub
        git branch: 'jenkin', url: 'https://github.com/lakpahana/team-wallet'
      }
        }
    }

        stage('Install Client Dependencies') {
      steps {
        // Change to the client directory and install dependencies
        dir('client') {
          sh 'npm install'
        }
      }
        }

        
      //   stage('Build Client') {
      // steps {
      //   // Change to the client directory and run the build command
      //   dir('client') {
      //     sh 'npm run build'
      //   }
      // }
      //   }

     

        stage('Install Backend Dependencies') {
      steps {
        // Change to the backend directory and install dependencies
        dir('.') {
          sh 'npm install'
        }
      }
        }


         stage("Build & Push Docker Image backend") {
            steps {
                script {
                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image = docker.build "${IMAGE_NAME}-back"
                    }

                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }

       }

	    stage("Build & Push Docker Image client") {
    steps {
        script {
            // Set the directory path where the Dockerfile is located
            def clientDir = 'client'

            docker.withRegistry('', DOCKER_PASS) {
                // Build the Docker image from the specified directory
                docker_image = docker.build("${IMAGE_NAME}-client", clientDir)
            }

            docker.withRegistry('', DOCKER_PASS) {
                // Push the built image with specified tags
                docker_image.push("${IMAGE_TAG}")
                docker_image.push('latest')
            }
        }
    }
}

	     stage("Trivy Scan Client") {
           steps {
               script {
	            sh ('docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image lakpahana/teamwallet-app-pipeline-client:latest --no-progress --scanners vuln  --exit-code 0 --severity HIGH,CRITICAL --format table')
               }
           }
       }

	       stage("Trivy Scan Client") {
           steps {
               script {
	            sh ('docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image lakpahana/teamwallet-app-pipeline-back:latest --no-progress --scanners vuln  --exit-code 0 --severity HIGH,CRITICAL --format table')
               }
           }
       }

       stage ('Cleanup Artifacts') {
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
