Use the following console command to spin up the docker db

````
docker run --name postgres -e POSTGRES_PASSWORD=example -p 5433:5432 -d postgres 
````