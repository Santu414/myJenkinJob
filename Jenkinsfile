pipeline {
    agent any

    options {
        timestamps()
    }

    parameters {
        choice(name: 'ENV', choices: ['dev', 'stage', 'prod'], description: 'Select Environment')
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Read Manifest') {
            steps {
                script {
                    def manifest = readYaml file: 'manifest.yaml'
                    def envVars = manifest.app.environment

                    envVars.each { key, value ->
                        env[key] = value.toString()
                    }

                    echo "Environment Variables Loaded:"
                    envVars.each { key, value ->
                        echo "${key} = ${value}"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Application') {
            steps {
                sh 'node app.js'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'application.log', fingerprint: true
        }
        success {
            echo "Build Successful ✅"
        }
        failure {
            echo "Build Failed ❌"
        }
    }
}
