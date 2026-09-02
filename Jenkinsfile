pipeline {
    agent any

    tools {
        jdk 'Java 21'
        nodejs 'NodeJS 18'
    }

    environment {
        // We use Jenkins credentials to avoid hardcoding secrets in the pipeline.
        // These credentials must be configured in Jenkins for the pipeline to succeed.
        TEST_DB_USERNAME = credentials('test-db-username')
        TEST_DB_PASSWORD = credentials('test-db-password')
        TEST_JWT_SECRET  = credentials('test-jwt-secret')
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
                    // Ensure the maven wrapper is executable on Linux agents
                    sh 'chmod +x mvnw'
                    sh './mvnw clean verify'
                }
            }
        }

        stage('Frontend Validation') {
            steps {
                dir('frontend') {
                    // Use clean installation based on package-lock.json
                    sh 'npm ci'
                    // Lint checking
                    sh 'npm run lint'
                    // Run frontend tests (vitest in run mode)
                    sh 'npm run test -- --run'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    // Fail if there are type checking or build errors
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        always {
            // Publish JUnit reports even if earlier stages failed
            junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml, backend/target/failsafe-reports/*.xml'
        }
        success {
            // Archive artifacts upon success
            archiveArtifacts artifacts: 'backend/target/*.jar, frontend/dist/**', allowEmptyArchive: true
        }
        cleanup {
            // Final cleanup of the workspace
            cleanWs()
        }
    }
}
