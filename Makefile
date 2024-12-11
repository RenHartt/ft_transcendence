all: up

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

restart:
	docker compose restart

stop:
	docker compose stop

clean:
	docker compose down --rmi all --volumes --remove-orphans

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
	@echo "  help      : Show this help message"
	@echo ""
	@echo "By default, 'make up' is executed."
	@echo ""