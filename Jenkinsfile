pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                scmSkip(deleteBuild: true, skipPattern:'.*\\[ci skip\\].*')
            }
        }
        stage('Build') {
            steps {
                sh "npm install"
                sh "npm run prebuild"
                sh "npm run build"
            }
        }
        stage('Unit Tests') {
            steps {
                sh "npm run test"
            }
        }
        stage("Tag and Push") {
            steps {
                sh "git checkout -B ${GIT_BRANCH}"
                sh "git add ."
                sh "git commit -m '[Jenkins CI][ci skip]'"
                sh "git push origin HEAD:${GIT_BRANCH}"
            }
        }
        stage('Deploy to PROD') {
            when { branch 'master' }
            steps {
                sh "npm run start:prod"
            }
        }
    }
}