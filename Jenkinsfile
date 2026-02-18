pipeline {
    agent any

    parameters {
        string(name: 'REPO_URL', defaultValue: 'https://github.com/Santu414/myJenkinJob', description: 'GitHub Repository URL')
        string(name: 'BRANCH_NAME', defaultValue: 'master', description: 'Branch Name')
        string(name: 'MANIFEST_PATH', defaultValue: 'manifest.yaml', description: 'Path to manifest file')
    }

    stages {

        stage('Checkout') {
            steps {
                git url: params.REPO_URL,
                    branch: params.BRANCH_NAME
            }
        }

        stage('Read Manifest') {
            steps {
                script {
                    def data = readYaml file: params.MANIFEST_PATH
                    
                    echo "App Name: ${data.app.name}"
                    echo "Version: ${data.app.version}"
                    echo "Environment: ${data.app.environment}"
                }
            }
        }
    }
}
