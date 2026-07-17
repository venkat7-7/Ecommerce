# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend-react
COPY frontend-react/package*.json ./
RUN npm ci
COPY frontend-react/ ./
RUN npm run build

# Stage 2: Create the Python runtime
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/frontend-react/dist ./frontend-react/dist

# Copy the application code
COPY . .

# Expose port
EXPOSE 8000

# Default command to run FastAPI app
CMD ["uvicorn", "ecommerce_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
