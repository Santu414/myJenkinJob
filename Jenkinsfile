pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    stages {
        stage('Install & Run') {
            steps {
                sh '''
                node -v
                npm install
                node app.js
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'application.log', fingerprint: true
        }
    }
}
