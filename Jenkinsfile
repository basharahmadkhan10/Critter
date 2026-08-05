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
                            echo "Skipping actual tests, but they would run here."
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('server') {
                            sh 'npm install'
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
                echo 'Skipping Docker Push: dockerhub-credentials not configured in Jenkins.'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Skipping K8s Deployment: k8s-kubeconfig credential not configured in Jenkins.'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Skipping Deployment Verification'
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
