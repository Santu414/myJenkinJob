pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                script {
                    echo "Branch Built : ${env.GIT_BRANCH}"
                }
            }
        }

        stage('Read Manifest') {
            steps {
                script {

                    if (!fileExists('manifest.yaml')) {
                        error("Manifest file not found!")
                    }

                    def data = readYaml file: 'manifest.yaml'

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

                    if (data.app.environment) {
                        data.app.environment.each { key, value ->
                            echo "${key} = ${value}"
                            env."${key}" = value.toString()
                        }
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
                    emailext(
                        subject: "GitHub Push - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """
                            Hi,

                            Your push to branch ${env.GIT_BRANCH} triggered this build.

                            Build URL: ${env.BUILD_URL}

                            Thanks,
                            Jenkins
                            """,
                        to: authorEmail
                    )
                }
            }
        }
    }
}