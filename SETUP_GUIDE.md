# SearchEngine Presentation - Setup Guide

## Prerequisites

1. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop
   - Make sure it's running (whale icon in system tray)

---

## Quick Start (3 Steps)

### Step 1: Open Terminal

Open PowerShell/Terminal in this project folder

### Step 2: Start the Application

```bash
docker compose up --build
```

Wait for it to finish (first time takes ~3-5 minutes)

### Step 3: Open Browser

- **Website**: http://localhost
- **Admin Panel**: http://localhost/admin/login

---

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these in production!**

---

## Configuration (Optional)

Edit `docker-compose.yml` to change:

```yaml
# Database password
POSTGRES_PASSWORD: your-secure-password

# Admin credentials
ADMIN_USERNAME: your-admin-name
ADMIN_PASSWORD: your-secure-password

# Security keys (change these!)
JWT_SECRET_KEY: your-random-secret-key
SECRET_KEY: another-random-secret-key
```

---

## Useful Commands

```bash
# Start containers (background mode)
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f

# Restart after code changes
docker compose up --build -d

# Stop and remove all data (fresh start)
docker compose down -v
```

---

## Troubleshooting

### "Port already in use"

Another app is using port 80, 5000, or 5433. Either:

- Stop the other app, OR
- Change ports in `docker-compose.yml`:
  ```yaml
  ports:
    - "8080:80" # Use localhost:8080 instead
  ```

### "Docker not running"

Make sure Docker Desktop is started (whale icon in system tray)

### Images/Videos not showing

Upload them through the Admin Panel:

1. Go to http://localhost/admin/login
2. Login with admin credentials
3. Use the editors to upload images/videos

---

## Project Structure

```
├── docker-compose.yml    # Main config - orchestrates all services
├── backend/              # Flask API (Python)
│   ├── Dockerfile
│   └── uploads/          # Uploaded images/videos stored here
├── frontend/             # React App
│   ├── Dockerfile
│   └── nginx.conf        # Web server config
└── SETUP_GUIDE.md        # This file
```

---

## Services

| Service  | URL                          | Description           |
| -------- | ---------------------------- | --------------------- |
| Frontend | http://localhost             | Main website          |
| Admin    | http://localhost/admin/login | Content management    |
| API      | http://localhost/api         | Backend API           |
| API Docs | http://localhost/api/docs    | Swagger documentation |

---

## Need Help?

If something doesn't work:

1. Check Docker Desktop is running
2. Run `docker compose logs` to see error messages
3. Try `docker compose down -v` then `docker compose up --build` for a fresh start
