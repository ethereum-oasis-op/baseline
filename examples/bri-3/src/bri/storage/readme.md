Use the following console command to spin up the docker db

````
docker run --name postgres -e POSTGRES_PASSWORD=example -p 5432:5432 -d postgres 
````

.env file
````
DATABASE_URL="postgresql://postgres:example@localhost:5432/postgres"
````
