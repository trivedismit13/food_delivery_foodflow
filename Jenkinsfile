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

        stage('Docker Build') {
            environment {
                FRONTEND_PORT = '3001'
                BACKEND_PORT = '8082'
                MYSQL_PORT = '3308'
                PROMETHEUS_PORT = '9091'
                DB_NAME = 'food_flow_ci'
                DB_USERNAME = 'root'
                DB_PASSWORD = credentials('test-db-password')
                MYSQL_ROOT_PASSWORD = credentials('test-db-password')
                JWT_SECRET = credentials('test-jwt-secret')
                CORS_ALLOWED_ORIGINS = 'http://localhost:3001'
                VITE_API_BASE_URL = 'http://localhost:8082/api'
                PROMETHEUS_CONFIG_SRC = 'prometheus_config'
                PROMETHEUS_CONFIG_DEST = '/etc/prometheus'
            }
            steps {
                sh 'docker compose -p foodflow-ci build'
            }
        }

        stage('Docker Smoke Test') {
            environment {
                FRONTEND_PORT = '3001'
                BACKEND_PORT = '8082'
                MYSQL_PORT = '3308'
                PROMETHEUS_PORT = '9091'
                DB_NAME = 'food_flow_ci'
                DB_USERNAME = 'foodflow_app'
                DB_PASSWORD = credentials('test-db-password')
                MYSQL_ROOT_PASSWORD = credentials('test-db-password')
                JWT_SECRET = credentials('test-jwt-secret')
                CORS_ALLOWED_ORIGINS = 'http://localhost:3001'
                VITE_API_BASE_URL = 'http://localhost:8082/api'
                PROMETHEUS_CONFIG_SRC = 'prometheus_config'
                PROMETHEUS_CONFIG_DEST = '/etc/prometheus'
            }
            steps {
                sh '''
                    # Populate the named volume with prometheus config before starting
                    docker volume create foodflow-ci_prometheus_config
                    docker rm -f dummy-prom-config >/dev/null 2>&1 || true
                    docker container create --name dummy-prom-config -v foodflow-ci_prometheus_config:/etc/prometheus alpine
                    if ! docker cp monitoring/prometheus/prometheus.yml dummy-prom-config:/etc/prometheus/prometheus.yml; then
                        docker rm -f dummy-prom-config
                        exit 1
                    fi
                    docker rm -f dummy-prom-config

                    # Start the Compose stack
                    docker compose -p foodflow-ci up -d
                    
                    check_http() {
                        local service=$1
                        local url=$2
                        docker compose -p foodflow-ci exec -T "$service" wget -qO- "$url" >/dev/null 2>&1 || \
                        docker compose -p foodflow-ci exec -T "$service" curl -s -f "$url" >/dev/null 2>&1
                    }

                    echo "Waiting for MySQL to become healthy..."
                    i=1
                    while [ "$i" -le 30 ]; do
                        if docker compose -p foodflow-ci ps mysql | grep -qi "healthy"; then
                            echo "MySQL is healthy."
                            break
                        fi
                        if docker compose -p foodflow-ci ps mysql | grep -qi "exited"; then
                            echo "MySQL container crashed."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=200 mysql
                            exit 1
                        fi
                        if [ "$i" -eq 30 ]; then
                            echo "Timeout waiting for MySQL."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=200 mysql
                            exit 1
                        fi
                        sleep 3
                        i=$((i + 1))
                    done

                    echo "Waiting for Backend to respond..."
                    i=1
                    while [ "$i" -le 30 ]; do
                        if check_http backend http://localhost:8080/actuator/health; then
                            echo "Backend is responding."
                            break
                        fi
                        if docker compose -p foodflow-ci ps backend | grep -qi "exited"; then
                            echo "Backend container crashed."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=200 backend
                            exit 1
                        fi
                        if [ "$i" -eq 30 ]; then
                            echo "Timeout waiting for Backend."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=200 backend
                            exit 1
                        fi
                        sleep 3
                        i=$((i + 1))
                    done

                    echo "Waiting for Frontend to respond..."
                    i=1
                    while [ "$i" -le 30 ]; do
                        if check_http frontend http://localhost:80/; then
                            echo "Frontend is responding."
                            break
                        fi
                        if docker compose -p foodflow-ci ps frontend | grep -qi "exited"; then
                            echo "Frontend container crashed."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=200 frontend
                            exit 1
                        fi
                        if [ "$i" -eq 30 ]; then
                            echo "Timeout waiting for Frontend."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=200 frontend
                            exit 1
                        fi
                        sleep 3
                        i=$((i + 1))
                    done

                    echo "Waiting for Prometheus to respond..."
                    i=1
                    while [ "$i" -le 30 ]; do
                        if check_http prometheus http://localhost:9090/-/healthy; then
                            echo "Prometheus is responding."
                            break
                        fi
                        if docker compose -p foodflow-ci ps prometheus | grep -qi "exited"; then
                            echo "Prometheus container crashed."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=100 prometheus
                            exit 1
                        fi
                        if [ "$i" -eq 30 ]; then
                            echo "Timeout waiting for Prometheus."
                            docker compose -p foodflow-ci ps
                            docker compose -p foodflow-ci logs --tail=100 prometheus
                            exit 1
                        fi
                        sleep 3
                        i=$((i + 1))
                    done
                '''
            }
        }
    }

    post {
        always {
            // Publish JUnit reports strictly from surefire. 
            // allowEmptyResults is removed so missing test results fail the build properly.
            junit testResults: 'backend/target/surefire-reports/*.xml'
            // Ensure docker compose stack is shut down to prevent port collisions
            // and resource leaks, but keep the data volumes (do not use -v)
            sh 'docker compose -p foodflow-ci down'
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
