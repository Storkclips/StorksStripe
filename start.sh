#!/bin/bash
# Railway start script for backend

cd backend
exec uvicorn server:app --host 0.0.0.0 --port ${PORT:-8001}
