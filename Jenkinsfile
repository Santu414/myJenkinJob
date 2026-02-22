pipeline {
    agent any

    triggers {
        githubPush()
    }

    parameters {
        string(name: 'REPO_URL',
               defaultValue: 'https://github.com/Santu414/myJenkinJob',
               description: 'GitHub Repository URL')


        string(name: 'MANIFEST_PATH',
               defaultValue: 'manifest.yaml',
               description: 'Path to manifest file')
    }

    stages {

        stage('Checkout') {
            steps {
                script {

                    def branch = params.BRANCH_NAME?.trim() ? params.BRANCH_NAME : env.GIT_BRANCH
                   

                    if (!branch) {
                        error("Branch not detected. Make sure build is triggered by GitHub webhook.")
                    }

                    branch = params.GIT_REF.replace('refs/heads/', '')

                    echo "Detected Branch: ${branch}"

                    git url: params.REPO_URL,
                        branch: branch
                }
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
    always {
        echo "===== PUSH DETECTED ====="
        echo "JOB_NAME     : ${env.JOB_NAME}"
        echo "BUILD_NUMBER : ${env.BUILD_NUMBER}"
        echo "BUILD_URL    : ${env.BUILD_URL}"
        echo "BRANCH       : ${env.GIT_BRANCH}"

        script {
            def authorEmail = ""

            for (changeLogSet in currentBuild.changeSets) {
                for (entry in changeLogSet.items) {
                    echo "Commit Author : ${entry.author}"
                    echo "Commit Message: ${entry.msg}"

                    authorEmail = entry.authorEmail
                }
            }

            if (authorEmail) {
                echo "Sending email to: ${authorEmail}"

                emailext(
                    subject: "GitHub Push Notification - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        Hi,

                        Your recent push triggered a Jenkins build.

                        Job Name: ${env.JOB_NAME}
                        Build Number: ${env.BUILD_NUMBER}
                        Build URL: ${env.BUILD_URL}

                        Thanks,
                        Jenkins
                    """,
                    to: authorEmail
                )
            } else {
                echo "Author email not found."
            }
        }
    }
}
}