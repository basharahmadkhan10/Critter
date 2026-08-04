# Smart Event Management Portal - DevOps Deployment

This project demonstrates a complete, enterprise-grade DevOps CI/CD pipeline deploying a containerized MERN stack application onto Kubernetes using Jenkins.

## 🏗️ Architecture & Tech Stack
*   **Frontend:** React, GSAP (Animations), Vite
*   **Backend:** Node.js, Express, MongoDB (Atlas), JWT Authentication
*   **Containerization:** Docker (Multi-stage builds)
*   **Orchestration:** Kubernetes (Deployments, Services, HPA)
*   **CI/CD Pipeline:** Jenkins (Declarative Pipeline)

## 🚀 Innovation Challenge Features Included
1.  **DevSecOps Pipeline:** Automated vulnerability scanning using `Trivy` integrated into the Jenkins pipeline before pushing to Docker Hub.
2.  **Optimized Docker Images:** Multi-stage Docker builds utilizing `node:alpine` and `nginx:alpine` to drastically reduce image sizes and improve security.
3.  **True Zero-Downtime Deployments:** Kubernetes Liveness and Readiness Probes configured in deployments, alongside a Horizontal Pod Autoscaler (HPA) to automatically handle traffic spikes.

---

## 🛠️ Local Development Setup

### 1. Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_cluster_uri
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=1d
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_user
MAILTRAP_PASS=your_pass
FRONTEND_URL=http://localhost:5173
```

### 2. Run Locally (without Docker)
**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
```
**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

### 3. Run Locally (with Docker Compose)
To spin up the entire application in containers:
```bash
docker-compose up --build
```

---

## ☸️ Kubernetes Deployment

Ensure you have a Kubernetes cluster running (e.g., Minikube).

1.  **Configure Secrets:** Edit `k8s/secrets.yaml` with your base64 encoded credentials.
    ```bash
    kubectl apply -f k8s/secrets.yaml
    ```
2.  **Apply Deployments:**
    ```bash
    kubectl apply -f k8s/backend-deployment.yaml
    kubectl apply -f k8s/frontend-deployment.yaml
    ```
3.  **Enable Autoscaling:**
    *(Ensure Metrics Server is enabled in your cluster)*
    ```bash
    kubectl apply -f k8s/hpa.yaml
    ```

---

## 🏗️ Jenkins CI/CD Setup

1. Install Jenkins and necessary plugins (Docker Pipeline, Kubernetes CLI, Git).
2. Configure Credentials in Jenkins:
    *   `dockerhub-credentials`: Username and Password for Docker Hub.
    *   `k8s-kubeconfig`: Secret file containing your Kubernetes `config` file.
3. Create a new Pipeline job and point it to this GitHub repository.
4. The pipeline will automatically build, test, scan (Trivy), push, and deploy to Kubernetes on every push. If a deployment fails, the `post { failure { ... } }` block will automatically rollback the cluster.
