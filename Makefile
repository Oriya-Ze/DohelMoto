# E-Shop Makefile

.PHONY: help build up down logs test clean dev prod

# Default target
help:
	@echo "E-Shop Development Commands:"
	@echo ""
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start development environment"
	@echo "  make down      - Stop development environment"
	@echo "  make logs      - View logs from all services"
	@echo "  make test      - Run all tests"
	@echo "  make clean     - Clean up containers and volumes"
	@echo "  make dev       - Start development with hot reload"
	@echo "  make prod      - Start production environment"
	@echo ""

# Build all images
build:
	@echo "Building Docker images..."
	docker compose build

# Start development environment
up:
	@echo "Starting development environment..."
	docker compose up -d
	@echo "Services started:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"

# Stop development environment
down:
	@echo "Stopping development environment..."
	docker compose down

# View logs
logs:
	docker compose logs -f

# Run tests
test:
	@echo "Running tests..."
	docker compose -f docker-compose.test.yml up --abort-on-container-exit

# Clean up
clean:
	@echo "Cleaning up containers and volumes..."
	docker compose down -v --remove-orphans
	docker system prune -f

# Development with hot reload
dev:
	@echo "Starting development environment with hot reload..."
	docker compose up

# Production environment
prod:
	@echo "Starting production environment..."
	docker compose -f docker-compose.prod.yml up -d
	@echo "Production services started"

# Database operations
db-shell:
	docker compose exec database psql -U ecommerce_user -d ecommerce_db

db-backup:
	docker compose exec database pg_dump -U ecommerce_user ecommerce_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore:
	@echo "Usage: make db-restore FILE=backup.sql"
	docker compose exec -T database psql -U ecommerce_user -d ecommerce_db < $(FILE)

# Backend operations
backend-shell:
	docker compose exec backend bash

backend-logs:
	docker compose logs -f backend

# Frontend operations
frontend-shell:
	docker compose exec frontend sh

frontend-logs:
	docker compose logs -f frontend

# Kubernetes operations
k8s-deploy:
	@echo "Deploying to Kubernetes..."
	kubectl apply -f k8s/

k8s-delete:
	@echo "Deleting Kubernetes resources..."
	kubectl delete -f k8s/

k8s-status:
	kubectl get pods -n ecommerce

# Utility commands
status:
	@echo "Service Status:"
	@docker compose ps

restart:
	@echo "Restarting all services..."
	docker compose restart

update:
	@echo "Updating and rebuilding..."
	docker compose pull
	docker compose build
	docker compose up -d

# Health checks
health:
	@echo "Checking service health..."
	@curl -f http://localhost:8000/health || echo "Backend: ❌"
	@curl -f http://localhost:3000 || echo "Frontend: ❌"
	@echo "Health check complete"

# Development helpers
install-deps:
	@echo "Installing dependencies..."
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

# Quick setup for new developers
setup:
	@echo "Setting up development environment..."
	cp .env.example .env
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env
	@echo "Please update .env files with your configuration"
	@echo "Then run: make up"
