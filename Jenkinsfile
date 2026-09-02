pipeline {
    agent any

    tools {
        jdk 'Java 21'
        nodejs 'NodeJS 22'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Test') {
            environment {
                // Non-secret environment variable required by test properties
                TEST_DB_USERNAME = 'root'
                // Secrets scoped only to the backend stage where they are needed
                TEST_DB_PASSWORD = credentials('test-db-password')
                TEST_JWT_SECRET  = credentials('test-jwt-secret')
            }
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
            // Publish JUnit reports strictly from surefire. 
            // allowEmptyResults is removed so missing test results fail the build properly.
            junit testResults: 'backend/target/surefire-reports/*.xml'
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
