pipeline {
    agent any

    triggers {
        githubPush()
    }

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
                }
            }
        }
    }

 post {
    success {
        echo "===== BUILD SUCCESS DETAILS ====="
        echo "JOB_NAME     : ${env.JOB_NAME}"
        echo "BUILD_NUMBER : ${env.BUILD_NUMBER}"
        echo "BUILD_URL    : ${env.BUILD_URL}"

        emailext(
            subject: "SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
            body: """
                Build Successful!

                Job Name: ${env.JOB_NAME}
                Build Number: ${env.BUILD_NUMBER}
                Build URL: ${env.BUILD_URL}
                App Version: ${env.APP_VERSION}
            """,
            recipientProviders: [developers(), requestor()]
        )
    }

    failure {
        echo "===== BUILD FAILURE DETAILS ====="
        echo "JOB_NAME     : ${env.JOB_NAME}"
        echo "BUILD_NUMBER : ${env.BUILD_NUMBER}"
        echo "BUILD_URL    : ${env.BUILD_URL}"

        emailext(
            subject: "FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
            body: """
                Build Failed!

                Job Name: ${env.JOB_NAME}
                Build Number: ${env.BUILD_NUMBER}
                Build URL: ${env.BUILD_URL}
            """,
            recipientProviders: [developers(), requestor()]
        )
    }
}
}