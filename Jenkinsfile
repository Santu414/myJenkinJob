pipeline {
    agent any

    // Triggered on GitHub push
    triggers {
        githubPush()
    }

    // Optional parameters (used if manually triggered)
    parameters {
        string(name: 'REPO_URL',
               defaultValue: 'https://github.com/Santu414/myJenkinJob',
               description: 'GitHub Repository URL')

        string(name: 'BRANCH_NAME',
               defaultValue: 'furure/test-1',
               description: 'Branch Name to Build (leave empty for webhook branch)')

        string(name: 'MANIFEST_PATH',
               defaultValue: 'manifest.yaml',
               description: 'Path to manifest file')
    }

    stages {

        stage('Checkout') {
            steps {
                script {
                    // Determine branch dynamically: parameter or webhook
                    def branch = params.BRANCH_NAME?.trim() ? params.BRANCH_NAME : env.GIT_BRANCH
                    echo "Building Branch - Before : ${branch}"
                    if (!branch) {
                        branch = 'feture/test-1' // fallback
                    }

                    // Extract repo name dynamically
                    def repoName = params.REPO_URL.tokenize('/').last().replace('.git','')

                    echo "Repository URL: ${params.REPO_URL}"
                    echo "Repository Name: ${repoName}"
                    echo "Building Branch : ${branch}"

                    // Checkout code
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

            script {
                // Get commit author email from changesets
                def authorEmail = ""

                if (currentBuild.changeSets) {
                    for (changeLogSet in currentBuild.changeSets) {
                        for (entry in changeLogSet.items) {
                            echo "Commit Author : ${entry.author}"
                            echo "Commit Message: ${entry.msg}"
                            if (!authorEmail) {
                                authorEmail = entry.authorEmail
                            }
                        }
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