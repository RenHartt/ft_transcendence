all: up

DOCKER_COMPOSE = $(shell command -v docker-compose 2>/dev/null)
DOCKER_CoMPOSE_EXEC_ALT := $(shell command -v docker 2>/dev/null && docker --help | grep -q 'compose')

ifeq ($(DOCKER_COMPOSE),)
    ifeq ($(DOCKER_COMPOSE_EXEC_ALT),)
        $(error Neither "docker-compose" nor "docker compose" found. Please install Docker Compose.)
    else
        DOCKER_COMPOSE = docker compose
    endif
endif

up:
	@echo "🚀 Starting the containers..."
	@$(DOCKER_COMPOSE) -f src/docker-compose.yml up -d --build

down:
	@echo "🛑 Stopping the containers..."
	@$(DOCKER_COMPOSE) -f src/docker-compose.yml down

clean:
	@echo "🧹 Cleaning up Docker environment (containers, images, volumes)..."
	@$(DOCKER_COMPOSE) -f src/docker-compose.yml down --rmi all --volumes --remove-orphans
	@echo "🔍 Checking for blocked ports..."
	@for port in $$DB_PORT; do \
		PID=$$(sudo lsof -t -i :$$port); \
		if [ ! -z "$$PID" ]; then \
			echo "💥 Killing process on port $$port (PID: $$PID)..."; \
			sudo kill -9 $$PID; \
		else \
			echo "✅ Port $$port is free."; \
		fi; \
	done
	@echo "✅ Cleanup completed."

restart:
	@echo "🔄 Restarting the containers..."
	@$(DOCKER_COMPOSE) -f src/docker-compose.yml restart

rebuild:
	@echo "🛠️ Rebuilding the containers..."
	@$(MAKE) down
	@$(MAKE) clean
	@$(MAKE) up

log:
	@echo "📋 Showing logs..."
	@$(DOCKER_COMPOSE) -f src/docker-compose.yml logs -f

stop:
	@echo "🛑 Stopping the containers (without removing them)..."
	@$(DOCKER_COMPOSE) -f src/docker-compose.yml stop

help:
	@echo "📖 Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  up        : 🚀 Start the containers"
	@echo "  down      : 🛑 Stop the containers"
	@echo "  logs      : 📋 Show logs"
	@echo "  restart   : 🔄 Restart the containers"
	@echo "  stop      : 🛑 Stop the containers (without removing them)"
	@echo "  clean     : 🧹 Stop and remove all data (containers, images, volumes)"
	@echo "  rebuild   : 🛠️ Rebuild the containers"
	@echo "  help      : 📖 Show this help message"
	@echo $(DOCKER_COMPOSE)
	@echo ""
	@echo "By default, 'make up' is executed."
	@echo ""
