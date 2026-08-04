pipeline {
    agent any

    environment {
        DOCKER_HUB_CRED = 'dockerhub-credentials'
        DOCKER_IMAGE_FRONTEND = 'bashar24k/eventportal-frontend'
        DOCKER_IMAGE_BACKEND = 'bashar24k/eventportal-backend'
        KUBECONFIG_CRED = 'k8s-kubeconfig'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('client') {
                            sh 'npm install'
                            // Assuming you have tests set up:
                            // sh 'npm run test'
                            echo "Skipping actual tests, but they would run here."
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('server') {
                            sh 'npm install'
                            // sh 'npm run test'
                            echo "Skipping actual tests, but they would run here."
                        }
                    }
                }
            }
        }

        stage('Docker Build & Scan') {
            parallel {
                stage('Frontend Build & Scan') {
                    steps {
                        dir('client') {
                            sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID} ."
                            // Innovation 1: DevSecOps Vulnerability Scanning
                            sh "trivy image --cache-dir /tmp/trivy-frontend --severity HIGH,CRITICAL --no-progress ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID}"
                        }
                    }
                }
                stage('Backend Build & Scan') {
                    steps {
                        dir('server') {
                            sh "docker build -t ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID} ."
                            sh "trivy image --cache-dir /tmp/trivy-backend --severity HIGH,CRITICAL --no-progress ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID}"
                        }
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CRED}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID}"
                    sh "docker push ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG')]) {
                    // Update the image tags in the deployment files
                    sh "sed -i 's|image: bashar24k/eventportal-frontend:v1|image: ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID}|g' k8s/frontend-deployment.yaml"
                    sh "sed -i 's|image: bashar24k/eventportal-backend:v1|image: ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID}|g' k8s/backend-deployment.yaml"
                    
                    // Apply the configurations
                    sh "kubectl apply -f k8s/"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG')]) {
                    sh "kubectl rollout status deployment/critter-frontend --timeout=60s"
                    sh "kubectl rollout status deployment/critter-backend --timeout=60s"
                }
            }
        }
    }

    post {
        failure {
            echo 'Deployment Failed. Initiating Rollback...'
            withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG')]) {
                sh "kubectl rollout undo deployment/critter-frontend"
                sh "kubectl rollout undo deployment/critter-backend"
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}
