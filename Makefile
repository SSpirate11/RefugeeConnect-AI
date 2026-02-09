# RefugeeConnect AI - Makefile
# Quick commands to manage the project

.PHONY: help install start stop test clean backend frontend all

# Default target
help:
	@echo "🌍 RefugeeConnect AI - Available Commands"
	@echo ""
	@echo "Setup Commands:"
	@echo "  make install          - Install all dependencies (backend + frontend)"
	@echo "  make install-backend  - Install backend dependencies only"
	@echo "  make install-frontend - Install frontend dependencies only"
	@echo ""
	@echo "Run Commands:"
	@echo "  make start            - Start both backend and frontend"
	@echo "  make backend          - Start backend only (port 8000)"
	@echo "  make frontend         - Start frontend only (port 5173)"
	@echo "  make stop             - Stop all running servers"
	@echo ""
	@echo "Test Commands:"
	@echo "  make test             - Run all API tests"
	@echo "  make test-health      - Test server health"
	@echo "  make test-auth        - Test authentication"
	@echo "  make test-credentials - Test credential upload"
	@echo "  make test-camera      - Test camera translation"
	@echo "  make test-advocate    - Test AI Advocate"
	@echo "  make test-navigator   - Test AI Navigator"
	@echo "  make test-all         - Run comprehensive test suite"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make clean            - Clean build artifacts"
	@echo "  make logs             - Show backend logs"
	@echo "  make check            - Check if servers are running"
	@echo ""

# Installation commands
install: install-backend install-frontend
	@echo "✅ All dependencies installed!"

install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && python -m venv .venv && \
	. .venv/bin/activate && \
	pip install -q -r requirements.txt
	@echo "✅ Backend dependencies installed!"

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Frontend dependencies installed!"

# Start commands
start:
	@echo "🚀 Starting RefugeeConnect AI..."
	@echo "Backend will run on: http://localhost:8001"
	@echo "Frontend will run on: http://localhost:3001"
	@echo "API Docs: http://localhost:8001/docs"
	@echo ""
	@make backend-bg
	@sleep 3
	@make frontend-bg
	@echo ""
	@echo "✅ All servers started!"
	@echo "👉 Open http://localhost:3001 in your browser"
	@echo "👉 Run 'make test' to test all features"
	@echo "👉 Run 'make stop' to stop all servers"

backend:
	@echo "🔧 Starting backend server..."
	cd backend && . .venv/bin/activate && uvicorn app.main:app --reload --port 8001

backend-bg:
	@echo "🔧 Starting backend server in background..."
	@cd backend && . .venv/bin/activate && \
	nohup uvicorn app.main:app --reload --port 8001 > ../backend.log 2>&1 & \
	echo $$! > ../backend.pid
	@sleep 2
	@if curl -s http://localhost:8001/health > /dev/null 2>&1; then \
		echo "✅ Backend started successfully!"; \
	else \
		echo "❌ Backend failed to start. Check backend.log"; \
		exit 1; \
	fi

frontend:
	@echo "⚛️  Starting frontend server..."
	cd frontend && npm run dev

frontend-bg:
	@echo "⚛️  Starting frontend server in background..."
	@cd frontend && \
	nohup npm run dev > ../frontend.log 2>&1 & \
	echo $$! > ../frontend.pid
	@echo "✅ Frontend started successfully!"

# Stop commands
stop:
	@echo "🛑 Stopping all servers..."
	@if [ -f backend.pid ]; then \
		kill `cat backend.pid` 2>/dev/null || true; \
		rm backend.pid; \
		echo "✅ Backend stopped"; \
	fi
	@if [ -f frontend.pid ]; then \
		kill `cat frontend.pid` 2>/dev/null || true; \
		rm frontend.pid; \
		echo "✅ Frontend stopped"; \
	fi
	@pkill -f "uvicorn app.main:app" 2>/dev/null || true
	@pkill -f "vite" 2>/dev/null || true
	@echo "✅ All servers stopped!"

# Test commands
test: test-health test-auth test-credentials test-camera test-advocate test-navigator
	@echo ""
	@echo "🎉 All tests completed! Check test_results.json for details"

test-health:
	@echo "🏥 Testing server health..."
	@python test_api.py health

test-auth:
	@echo "🔐 Testing authentication..."
	@python test_api.py auth

test-credentials:
	@echo "🎓 Testing credential upload & analysis..."
	@python test_api.py credentials

test-camera:
	@echo "📷 Testing camera translation..."
	@python test_api.py camera

test-advocate:
	@echo "💬 Testing AI Advocate..."
	@python test_api.py advocate

test-navigator:
	@echo "🧭 Testing AI Navigator..."
	@python test_api.py navigator

test-all:
	@echo "🧪 Running comprehensive test suite..."
	@python test_api.py all

# Utility commands
check:
	@echo "🔍 Checking server status..."
	@if curl -s http://localhost:8001/health > /dev/null 2>&1; then \
		echo "✅ Backend is running (http://localhost:8001)"; \
	else \
		echo "❌ Backend is not running"; \
	fi
	@if curl -s http://localhost:5173 > /dev/null 2>&1; then \
		echo "✅ Frontend is running (http://localhost:5173)"; \
	else \
		echo "❌ Frontend is not running"; \
	fi

logs:
	@echo "📋 Backend logs (last 50 lines):"
	@tail -50 backend.log 2>/dev/null || echo "No backend logs found"

clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf backend/__pycache__ backend/**/__pycache__
	@rm -rf frontend/dist frontend/node_modules/.vite
	@rm -f backend.log frontend.log backend.pid frontend.pid
	@rm -f backend/refugeeconnect.db
	@echo "✅ Cleaned!"

# Quick demo
demo: start
	@echo ""
	@echo "🎬 Demo Mode Activated!"
	@echo ""
	@echo "📝 Quick Test Checklist:"
	@echo "1. Open http://localhost:5173"
	@echo "2. Register a new account"
	@echo "3. Upload a credential image"
	@echo "4. Try camera translation"
	@echo "5. Chat with AI Advocate"
	@echo "6. Ask AI Navigator a question"
	@echo ""
	@echo "Run 'make test-all' to run automated tests"
