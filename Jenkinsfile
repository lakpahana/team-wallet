pipeline {
    agent any

    // Define tools to be installed
    tools {
        // Install Node.js tool with a specific version
        nodejs 'node:latest'
    }

    stages {
        stage('Checkout') {
      steps {
        // Check out the repository from GitHub
        git branch: 'jenkin', url: 'https://github.com/lakpahana/team-wallet'
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

        stage('Build Client') {
      steps {
        // Change to the client directory and run the build command
        dir('client') {
          sh 'npm run build'
        }
      }
        }

        stage('Install Backend Dependencies') {
      steps {
        // Change to the backend directory and install dependencies
        dir('.') {
          sh 'npm install'
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
