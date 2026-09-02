pipeline {
    agent any

    tools {
        jdk 'Java 21'
        nodejs 'NodeJS 18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh './mvnw clean verify'
                }
            }
        }

        stage('Frontend Test') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run lint'
                    sh 'npm run test -- --run'
                }
            }
        }

        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml, backend/target/failsafe-reports/*.xml'
        }
        success {
            archiveArtifacts artifacts: 'backend/target/*.jar, frontend/dist/**', allowEmptyArchive: true
        }
    }
}
