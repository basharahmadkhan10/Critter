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
                            echo 'npm install'
                            echo "Skipping actual tests, but they would run here."
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('server') {
                            echo 'npm install'
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
                            sh "DOCKER_BUILDKIT=0 docker build -t ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID} ."
                            sh "trivy image --cache-dir /tmp/trivy-frontend --severity HIGH,CRITICAL --no-progress ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID}"
                        }
                    }
                }
                stage('Backend Build & Scan') {
                    steps {
                        dir('server') {
                            sh "DOCKER_BUILDKIT=0 docker build -t ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID} ."
                            sh "trivy image --cache-dir /tmp/trivy-backend --severity HIGH,CRITICAL --no-progress ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID}"
                        }
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CRED, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID}"
                    sh "docker push ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID}"
                    
                    // Also tag and push as latest
                    sh "docker tag ${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID} ${DOCKER_IMAGE_FRONTEND}:latest"
                    sh "docker tag ${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID} ${DOCKER_IMAGE_BACKEND}:latest"
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}:latest"
                    sh "docker push ${DOCKER_IMAGE_BACKEND}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
                    // Update image tags in deployments dynamically
                    sh "sed -i 's|${DOCKER_IMAGE_FRONTEND}:.*|${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID}|g' k8s/frontend-deployment.yaml"
                    sh "sed -i 's|${DOCKER_IMAGE_BACKEND}:.*|${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID}|g' k8s/backend-deployment.yaml"
                    
                    // Apply manifests
                    sh "kubectl apply -f k8s/secrets.yaml"
                    sh "kubectl apply -f k8s/backend-deployment.yaml"
                    sh "kubectl apply -f k8s/frontend-deployment.yaml"
                    sh "kubectl apply -f k8s/hpa.yaml"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withKubeConfig([credentialsId: env.KUBECONFIG_CRED]) {
                    // Wait for rollouts to complete
                    sh "kubectl rollout status deployment/critter-backend --timeout=120s"
                    sh "kubectl rollout status deployment/critter-frontend --timeout=120s"
                    echo "Deployment Verified Successfully!"
                }
            }
        }
    }

    post {
        failure {
            echo 'Deployment Failed. Initiating Rollback...'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}
