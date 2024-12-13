all: up

up:
	docker compose -f src/docker-compose.yml up -d --build

down:
	docker compose -f src/docker-compose.yml down

clean:
	docker compose -f src/docker-compose.yml down --rmi all --volumes --remove-orphans

restart:
	docker compose -f src/docker-compose.yml restart

rebuild: down clean up

logs:
	docker compose -f src/docker-compose.yml logs -f

stop:
	docker compose -f src/docker-compose.yml stop

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  up        : Start the containers"
	@echo "  down      : Stop the containers"
	@echo "  logs      : Show logs"
	@echo "  restart   : Restart the containers"
	@echo "  stop      : Stop the containers"
	@echo "  clean     : Stop the containers and remove all the data"
	@echo "  rebuild   : Rebuild the containers"
	@echo "  help      : Show this help message"
	@echo ""
	@echo "By default, 'make up' is executed."
	@echo ""