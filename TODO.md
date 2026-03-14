# TODO: Fix Configuration Errors

## Current Issues Identified:
1. Database mismatch - docker-compose uses MySQL, but application uses MongoDB
2. Port mismatches between docker-compose and application configurations

## Fixes Applied:

### 1. ✅ Update docker-compose.yml to use MongoDB
- Changed MySQL service to MongoDB (mongo:6.0)
- Updated backend to use MongoDB connection string
- Aligned backend port to 8084
- Updated frontend port mapping to 3000:80

### 2. ✅ Updated Application Configuration
- Backend application.yml now uses environment variables with fallbacks
- MongoDB URI configurable via SPRING_DATA_MONGODB_URI
- Server port configurable via SERVER_PORT

### 3. ✅ Frontend Configuration
- Frontend API configured to connect to backend on port 8084
- Added Docker API base URL constant for container networking

## Completed
All configuration errors have been fixed. The application now has consistent MongoDB and port configuration across all files.

## Running the Application

### Local Development:
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Start Backend (port 8084)
cd backend && mvn spring-boot:run

# Start Frontend (port 3000)
cd frontend && npm start
```

### Docker Compose:
```bash
docker-compose up --build
```

### Service URLs:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8084
- MongoDB: localhost:27017
- ML Service: http://localhost:8001

