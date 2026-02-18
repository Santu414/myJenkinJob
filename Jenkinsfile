pipeline {
    agent any

    parameters {
        string(name: 'REPO_URL', 
               defaultValue: 'https://github.com/Santu414/myJenkinJob', 
               description: 'GitHub Repository URL')

        string(name: 'BRANCH_NAME', 
               defaultValue: 'master', 
               description: 'Branch Name')

        string(name: 'MANIFEST_PATH', 
               defaultValue: 'manifest.yaml', 
               description: 'Path to manifest file')
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

                    if (!fileExists(params.MANIFEST_PATH)) {
                        error("Manifest file not found at ${params.MANIFEST_PATH}")
                    }

                    def data = readYaml file: params.MANIFEST_PATH

                    if (!data?.app?.name) {
                        error("App name missing in manifest!")
                    }

                    echo "========== APPLICATION INFO =========="
                    echo "App Name : ${data.app.name}"

                    if (data.app.version) {
                        echo "Version  : ${data.app.version}"
                        env.APP_VERSION = data.app.version
                    }

                    echo "========== ENV VARIABLES =========="

                    data.app.environment.each { key, value ->
                        echo "${key} = ${value}"
                        env."${key}" = value.toString()
                    }

                    echo "========== EXPORTED ENV =========="
                    echo "NODE_ENV from env: ${env.NODE_ENV}"
                    echo "PORT from env: ${env.PORT}"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
