# Hospital Management System - Deployment Guide

This guide details how to deploy the **Frontend** and **Backend** separately into production hosting environments for free or low-cost cloud setups.

---

## Architecture Overview

```
 [ Client Browser ]
        |
        v
 [ Frontend: Vercel / Netlify ]
    - React 18 + Vite SPA
    - Public URL: https://hospital-management.vercel.app
        |
        | REST API Calls (Axios with JWT Bearer Token)
        v
 [ Backend: Render / Railway / Docker ]
    - Spring Boot 3.2.3 (Java 17)
    - Public URL: https://hospital-backend.onrender.com
        |
        v
 [ Database: Cloud MySQL (Render / Railway / Aiven / PlanetScale) ]
    - MySQL 8.x
```

---

## Part 1: Deploying the Backend (Spring Boot + MySQL)

### Option A: Render (Recommended)

1. **Push your code to GitHub** (already completed).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
3. Connect your GitHub repository: `saiganeshchalla071-stack/hospital_management`.
4. Render will detect `render.yaml` and automatically configure:
   - Managed MySQL Database (`hospital-db`)
   - Web Service (`hospital-management-backend`) using `backend/Dockerfile`
5. Alternatively, if creating a manual Web Service on Render:
   - **Environment**: `Docker`
   - **Root Directory**: `backend`
   - **Docker Context**: `backend`
   - **DockerfilePath**: `backend/Dockerfile`
   - **Environment Variables**:
     - `PORT`: `8085`
     - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<db-host>:<port>/<dbname>?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true`
     - `SPRING_DATASOURCE_USERNAME`: `<db-user>`
     - `SPRING_DATASOURCE_PASSWORD`: `<db-password>`
     - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
     - `CORS_ALLOWED_ORIGINS`: `https://*.vercel.app,https://*.netlify.app,https://*.onrender.com`
6. Click **Deploy**. Note your backend public URL (e.g., `https://hospital-backend.onrender.com`).

### Option B: Railway

1. Go to [Railway.app](https://railway.app/).
2. Create a new project and add a **MySQL** database.
3. Add a new service from your GitHub repo `saiganeshchalla071-stack/hospital_management`.
4. Set the Root Directory to `/backend`.
5. Under **Variables**, add the MySQL connection variables provided by Railway:
   - `SPRING_DATASOURCE_URL`: `${{MYSQL_URL}}`
   - `SPRING_DATASOURCE_USERNAME`: `${{MYSQLUSER}}`
   - `SPRING_DATASOURCE_PASSWORD`: `${{MYSQLPASSWORD}}`
   - `PORT`: `8085`

---

## Part 2: Deploying the Frontend (React + Vite)

### Option A: Vercel (Recommended)

1. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import repository `saiganeshchalla071-stack/hospital_management`.
3. In **Project Configuration**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://<YOUR-BACKEND-URL>.onrender.com/api`
   *(Example: `https://hospital-backend.onrender.com/api`)*
5. Click **Deploy**.
   - SPA routing is already configured via `frontend/vercel.json`.

### Option B: Netlify

1. Sign in to [Netlify](https://app.netlify.com/) and click **Add new site** -> **Import an existing project**.
2. Select your GitHub repository.
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Under **Environment variables**, add:
   - `VITE_API_BASE_URL`: `https://<YOUR-BACKEND-URL>.onrender.com/api`
5. Click **Deploy site**.
   - Netlify redirects are already configured via `frontend/netlify.toml`.

---

## Part 3: Verifying Cross-Origin Connection

1. Once the backend finishes deployment, test its health in your browser:
   ```
   https://<YOUR-BACKEND-URL>/api/departments
   ```
   You should receive a `200 OK` JSON response with departments.

2. Open your deployed frontend URL (e.g., `https://hospital-management.vercel.app`):
   - Register a new patient or log in with default credentials:
     - **Admin**: `admin@hospital.com` / `Admin@123`
     - **Doctor**: `sarah.jenkins@hospital.com` / `Doctor@123`
     - **Patient**: `john.doe@gmail.com` / `Patient@123`
   - Verify appointment bookings, medical records, and billing.
