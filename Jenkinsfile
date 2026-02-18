pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Santu414/myJenkinJob',
                    branch: 'master'
            }
        }

        stage('Read YAML') {
            steps {
                script {
                    def data = readYaml file: 'manifest.yaml'
                    
                    echo "App Name: ${data.app.name}"
                    echo "Version: ${data.app.version}"
                    echo "Environment: ${data.app.environment}"
                }
            }
        }
    }
}
