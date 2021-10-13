.PHONY: clean reset restart start start-attached stop

clean:
	docker-compose down --rmi all --volumes --remove-orphans

logs:
	docker-compose logs -f

reset: stop clean
	docker-compose up -d --build --force-recreate --remove-orphans

restart: stop start

start:
	docker-compose up && docker network prune -f && docker network prune -f && docker volume prune -f

start-attached:
	docker compose up --remove-orphans

stop:
	docker-compose down && prvd baseline stack stop --name BobCorp && prvd baseline stack stop --name AliceCorp

integration: 
	docker build -f Dockerfile.test -t bri-1-integration-suite . && docker run -t bri-1-integration-suite