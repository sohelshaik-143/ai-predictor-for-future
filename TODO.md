# TODO: Fix Frontend and Backend Errors

## Issues Identified:

### 1. Port Mismatches
- Frontend API base URL: `http://localhost:8084` (api.js) but backend runs on `8080`
- OAuth2 redirect in SecurityConfig points to `http://localhost:3000` but frontend typically runs on 3000

### 2. Database Configuration Mismatch
- application.yml uses MongoDB (`spring.data.mongodb.uri`)
- docker-compose.yml uses MySQL

### 3. CORS Configuration
- Backend CORS allows only `http://localhost:3000`
- Need to ensure consistency

### 4. OAuth2 Login Endpoint
- Frontend calls `http://localhost:8084/oauth2/authorize/google` but backend is on port 8080

## Fix Plan:

### Step 1: Fix Frontend API Base URL
- Update `frontend/src/api/api.js` to use port 8080

### Step 2: Fix CORS Configuration in Backend
- Update `SecurityConfig.java` to allow frontend port

### Step 3: Fix OAuth2 Redirect URI
- Update `SecurityConfig.java` to redirect to correct frontend URL

### Step 4: Fix Frontend OAuth2 Login URL
- Update `Login.jsx` to use correct backend port

### Step 5: Choose and Configure Database
- Option A: Use MongoDB (current config in application.yml)
- Option B: Switch to MySQL (docker-compose.yml)

For simplicity, we'll use MongoDB as it's already configured.

### Step 6: Run Both Frontend and Backend

