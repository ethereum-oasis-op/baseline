#Steps to follow :

1. In order to install the project dependencies, execute (on package level)

```npm install```

2. Execute the Docker compose file in package to trigger the Kafka container. 
   Currently it listens to port => localhost:9092. Feel free to update docker-compose.yml file

```docker-compose up```

3. Prepare the Kakfa Producer and dedicate a Topic. For now, it is pointing to battleship.
   Change this in production env

```docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1  --partitions 1 --topic battleship```

   If above is deprecated, try this

```docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1  --partitions 1 --topic battleship```

4. Run the consumer node in order to process messages
```npm run start:consumer```

5. Pass Kafka messages. Configure this according to need
```node run dev```