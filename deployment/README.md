# Containerized Deployment Guide — KKK Wheel Care

This directory contains the production-grade multi-container Docker configuration for **KKK Wheel Care**, orchestrating four distinct tiers:

1. **`mysql-db`**: MySQL 8.0 relational database with persistent named storage and automatic schema initialization.
2. **`seneca-service`**: Microservice engine running Seneca.js pattern-matching on port 5001.
3. **`backend`**: Node.js Express REST API server running on port 5000.
4. **`frontend`**: Angular 20 SPA served via a high-performance Nginx reverse proxy on port 80.

---

## 🛠️ Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Engine version 24.0+ and Docker Compose v2+).

---

## 🚀 How to Launch the Stack

1. **Configure Environment:**
   ```bash
   cp deployment/.env.docker.example deployment/.env
   ```
   *Edit `deployment/.env` to customize your production database password.*

2. **Build and Start All Containers:**
   ```bash
   docker compose -f deployment/docker-compose.yml up --build -d
   ```

3. **Verify Running Containers:**
   ```bash
   docker compose -f deployment/docker-compose.yml ps
   ```

4. **Access Applications in Browser:**
   * **Web Application (Angular)**: `http://localhost`
   * **API Health Diagnostic**: `http://localhost:5000/api/health`
   * **Seneca Microservice Health**: `http://localhost:5001/health`

---

## 🔍 Monitoring & Logs

* **Stream live logs across all containers:**
  ```bash
  docker compose -f deployment/docker-compose.yml logs -f
  ```
* **Inspect backend logs specifically:**
  ```bash
  docker compose -f deployment/docker-compose.yml logs -f backend
  ```
* **Inspect Seneca microservice logs:**
  ```bash
  docker compose -f deployment/docker-compose.yml logs -f seneca-service
  ```

---

## 🛑 How to Stop the Stack

* **Graceful shutdown (preserving database data volume):**
  ```bash
  docker compose -f deployment/docker-compose.yml down
  ```
* **Full reset (including data volumes — CAUTION):**
  ```bash
  docker compose -f deployment/docker-compose.yml down -v
  ```

---

## 🔧 Troubleshooting Guide

| Issue | Likely Cause | Solution |
| :--- | :--- | :--- |
| `backend` container restarts repeatedly | MySQL is still initializing | The compose file includes healthchecks (`mysqladmin ping`). Wait 30 seconds for the healthcheck to turn `healthy`. |
| Port 80 or 5000 is already in use | Another local service (IIS, Apache, Node) is running | Stop the conflicting process or change host port mapping in `docker-compose.yml`. |
| Angular API calls fail in browser | Incorrect reverse proxy mapping | Ensure Nginx `proxy_pass http://backend:5000/api/;` is active and reachable within `kkk_internal_network`. |
