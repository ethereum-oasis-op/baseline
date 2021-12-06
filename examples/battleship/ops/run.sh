export COMPOSE_DOCKER_CLI_BUILD=1 && export DOCKER_BUILDKIT=1

docker-compose --profile infra up -d

docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1  --partitions 1 --topic battleship
docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1  --partitions 1 --topic orgReg
docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1  --partitions 1 --topic workgroupReg
docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1  --partitions 1 --topic game
docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1  --partitions 1 --topic proof

docker-compose --profile bpi up -d