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

        stage('CI Network Diagnostics') {
            steps {
                sh '''
                    hostname
                    ip addr || true
                    ip route || true
                    getent hosts foodflow-jenkins-mysql || true
                    timeout 5 bash -c '</dev/tcp/foodflow-jenkins-mysql/3306' \\
                        && echo "MYSQL_TCP_CONNECTED" \\
                        || echo "MYSQL_TCP_FAILED"
                    cat /etc/resolv.conf || true
                '''
            }
        }

        stage('Backend Test') {
            environment {
                SPRING_DATASOURCE_URL = 'jdbc:mysql://foodflow-jenkins-mysql:3306/food_flow?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata'
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
                    // Run frontend tests sequentially to avoid OOM in CI
                    sh 'npm run test -- --run --no-file-parallelism'
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
