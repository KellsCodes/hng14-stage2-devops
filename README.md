# Full-Stack Job Processing System with CI/CD

A production-grade, containerized job processing application featuring an automated six-stage CI/CD delivery pipeline.

---

## 📋 Prerequisites

Before bringing up the stack, ensure your machine has the following installed:
* **Docker** (v24.0.0 or higher)
* **Docker Compose** (V2 - accessed via `docker compose` without a hyphen)
* **Git** (to clone the repository)

*Note: This stack is configured to run on standard Linux, macOS, or Windows via WSL2.*

---

## Getting Started from Scratch

Follow these steps to bring up the entire application on a clean machine:

### 1. Clone the Repository
```bash
git clone https://github.com/KellsCodes/hng14-stage2-devops.git
cd hng14-stage2-devops
```

### 2. Configure Environment Variables
Copy the example environment file and adjust values, very important:
```bash
cp .env.example .env
```

### 3. Build and Start the Stack
Run the following command to build the custom images and start the services in the background:
```bash
docker compose up -d --build
```

---

## What a Successful Startup Looks Like

To verify that the system is running correctly, perform these checks:

### 1. Check Container Status
Run `docker compose ps`. You should see four containers with a status of `Up` or `Up (healthy)`:
* `redis`
* `api`
* `worker`
* `frontend`

### 2. Verify Resource Limits
Run `docker stats --no-stream` to confirm that the memory and CPU caps configured in the `docker-compose.yml` are actively enforced on all services.

### 3. Access the Dashboard
Open your web browser and navigate to `http://localhost:3000`. 
* Click the submit button.
* You should see a job ID generated.
* The job state will transition from `queued` to `completed` in approximately 2 seconds as the Python worker processes the queue.

---

## Tearing Down
To safely stop the cluster and wipe its associated volumes, run:
```bash
docker compose down -v
```
