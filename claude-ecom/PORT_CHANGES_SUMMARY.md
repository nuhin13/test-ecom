# Port Configuration Changes Summary

## ✅ All Port Updates Complete

### Port Mapping Changes

| Service | Old Port | New Port | Notes |
|---------|----------|----------|-------|
| **MongoDB** | 27017 | 10000 | External access port (internal Docker port remains 27017) |
| **Backend API** | 5000 | 10001 | All references updated |
| **Frontend** | 3000 | 10002 | All references updated |

---

## Files Updated (20 files)

### ✅ Environment & Configuration
1. `.env` - Updated PORT, API URLs, and CORS origins
2. `.env.example` - Updated PORT, API URLs, and CORS origins
3. `docker-compose.yml` - Updated all port mappings and environment variables

### ✅ Backend Files
4. `backend/package.json` - No changes needed (no hardcoded ports)
5. `backend/Dockerfile` - Updated EXPOSE and health check URL
6. `backend/src/config/env.ts` - Updated default port and MongoDB URI
7. `backend/src/index.ts` - No changes needed (uses config)
8. `backend/tests/product.test.ts` - Updated MongoDB test connection URL
9. `backend/tests/auth.test.ts` - Updated MongoDB test connection URL

### ✅ Frontend Files
10. `frontend/package.json` - Updated dev and start scripts with `-p 10002` flag
11. `frontend/Dockerfile` - Updated EXPOSE and ENV PORT
12. `frontend/next.config.js` - Updated default API URL
13. `frontend/src/lib/api.ts` - Updated default API URL
14. `frontend/src/app/page.tsx` - No changes needed (uses env var)
15. All other frontend pages - No changes needed (use env vars)

### ✅ Scripts
16. `scripts/package.json` - No changes needed (no hardcoded ports)
17. `scripts/seed.ts` - Updated MongoDB URI default

### ✅ Documentation
18. `README.md` - Updated all 14 port references
19. `API_DOCUMENTATION.md` - Updated base URL and curl examples

---

## Important Notes

### Docker Port Mapping
The MongoDB service in Docker uses **port mapping**:
- **External port**: `10000` (what you connect to from your host machine)
- **Internal port**: `27017` (MongoDB's default port inside the container)
- **Docker network**: Services communicate using `mongodb://mongo:27017` (internal)

This is **CORRECT** and should not be changed. The URI `mongodb://mongo:27017/bd-sourcing` is used:
- Inside docker-compose environment variables
- Between containers in the Docker network

### Local Development Port Mapping
When running locally (without Docker):
- MongoDB: Connect to `localhost:10000`
- Backend: Runs on `localhost:10001`
- Frontend: Runs on `localhost:10002`

---

## How to Use

### With Docker:
```bash
# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:10002
# Backend: http://localhost:10001
# MongoDB: localhost:10000
```

### Local Development:
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Runs on port 10001

# Terminal 2 - Frontend
cd frontend
npm run dev
# Runs on port 10002 (specified in package.json)
```

---

## Testing the Changes

### 1. Test Backend
```bash
curl http://localhost:10001/health
# Should return: {"success":true,"message":"Server is running",...}
```

### 2. Test Frontend
```bash
# Open browser
http://localhost:10002
```

### 3. Test MongoDB Connection
```bash
# If MongoDB is running locally
mongosh --port 10000

# Or if using Docker
docker exec -it bd-sourcing-mongo mongosh
```

---

## Environment Variable Reference

Your `.env` file should now have:
```env
PORT=10001
MONGODB_URI=mongodb://mongo:27017/bd-sourcing
NEXT_PUBLIC_API_URL=http://localhost:10001/api
NEXTAUTH_URL=http://localhost:10002
ALLOWED_ORIGINS=http://localhost:10002,http://localhost:10003
```

---

## No Further Changes Needed

✅ All source code files use environment variables
✅ All configuration files updated
✅ All documentation updated
✅ Docker configuration correct
✅ Package.json scripts updated

**Status**: Ready to use! 🚀

---

Generated: 2025-01-13
