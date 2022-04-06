# Radish34

This README will help you run the Radish34 demo on an AWS EC2 instance based on Amazon Linux.

__Radish34__ is a product procurement application that utilizes the __Baseline Protocol__ to gain unprecedented data integrity while maintaining privacy and security for its users.

Disclaimer: This implementation is a demo, and production aspects of key management, wallet management, cloud hosting, integration to other third party tools and performance optimization are left out of scope to drive adoption and present a base set of tools for the community to provide inputs and take this further.

## Prerequisites to run the demo on an Amazon Linux EC2 instance

Provision an Amazon EC2 instance, using the latest Amazon Linux 2 AMI, with 16GB of RAM & 50GB of disk, such as t3a.xlarge or similar. Make sure it has a public IP address so you can SSH to the instance and access the Radish UI once the demo is running. You can consider using AWS Systems Manager Session Manager to SSH to the instance without needing a keypair.

Open the following ports on the instance security group to accept requests from the UI: 3000, 8001, 8002, 8003. This is in addition to port 22 if you are using SSH to access the instance.

If you are not familiar with using Amazon EC2, see here to get started: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html

Carry out the steps below on the EC2 instance:
    
1.  Install Git & Docker. 
  
    ```
    sudo yum update -y
    sudo yum install gcc-c++ -y
    sudo yum install libusb -y
    sudo yum install git -y
    sudo yum install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo chmod 666 /var/run/docker.sock
    ```

1. NodeJS version 11.15 installed (use of NVM is recommended)

    ```
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    . ~/.nvm/nvm.sh
    nvm install 11
    nvm use 11
    ```

1. Install docker-compose:

    ```
    sudo curl -L https://github.com/docker/compose/releases/download/1.20.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

1.  Clone this repo locally:

    ```
    cd ~
    git clone https://github.com/ethereum-oasis/baseline.git
    ```

1. Follow the Quickstart steps in the baseline [README](../README.md)

## Setup the Radish demo on AWS
A few small changes are required to configure the UI to use the correct AWS endpoints.

1. Change the endpoints of the API servers for the buyer and suppliers. The endpoints will point to the EC2 instance where you are running the demo.

Edit the following file:

`ui/public/config.js`

Change the radishAPIURL to the DNS of your EC2 instance, for example (your endpoint will differ). Do not include the protocol (i.e. https://):

```
    radishAPIURL: 'ec2-34-207-152-195.compute-1.amazonaws.com:8001',
```

Edit the following file:

`ui/src/config-radish.json`

Change the URLs to the DNS of your EC2 instance:

```
    "radishBuyerAPIURL": "ec2-34-207-152-195.compute-1.amazonaws.com:8001",
    "radishSupplier1APIURL": "ec2-34-207-152-195.compute-1.amazonaws.com:8002",
    "radishSupplier2APIURL": "ec2-34-207-152-195.compute-1.amazonaws.com:8003"
```

1. Run `make start`. Once all containers have started, wait a minute or two for the UI container to start (you can check the logs by navigating to the radish34 folder and entering `docker-compose logs -f ui`).

1. You should be able to access the UI at the address below, provided you opened the appropriate ports on your EC2 security group. Note that you endpoint URL will differ.

```
http://ec2-34-207-152-195.compute-1.amazonaws.com:3000/
```

1. If you cannot access the endpoint, try to access the graphql endpoint by entering this in the browser:

```
http://ec2-34-207-152-195.compute-1.amazonaws.com:8001/graphql
```

If you cannot access the endpoint, it could be related to the issue in the troublshooting section below. If you execute `make test` and see failed tests it could be related to endpoints that are not accessible, such as the API endpoints. Try the solution mentioned in troubleshooting in the Radish README.

1. You can also run the integration tests from the baseline folder: `make test`. The integrations tests should run successfully regardless of whether your API endpoints are pointing to 'localhost' or to your EC2 endpoint. ** This takes about 3-5 minutes to run to completion **

## Re-establishing your SSH session and rerunning the demo
If you exit your SSH session and need to re-establish it, carry out the following steps.

Start or restart the Docker containers:

```
cd baseline
make restart
```

Check the logs for the UI container to make sure it is running:

```
docker-compose logs -f ui
```
  
Rerun the integration tests to make sure the demo is working correctly:

```
make test
```

Access the demo via a browser using your EC2 public endpoint:

```
http://ec2-34-207-152-195.compute-1.amazonaws.com:3000/
```
   
## Troubleshooting

1. Running the UI
   - If the UI home page doesn't display, or you see errors when navigating to different pages, check the browser developer console for details on the errors. In some cases the page might be cached (if you have run the demo before). You can clear the cache using Command-Shift-R on Mac. You can also clear the storage cache where the UI stores information such as API endpoints. In the web developer tools section of the browser, look for Storage->Local Storage. You'll see an entry for Radish34 which you can safely delete.

1. If your UI is non-responsive, check if you see this error when running `make start` or `make restart`: `(node:19) UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED 172.30.0.7:4001`. You'll need to rerun `make start`.

1. If you see this `ERROR: Pool overlaps with other one on this address space`, you can forcefully remove the docker network as follows:

```
make stop
docker volume prune -f && echo volume pruned && docker system prune -f && echo system pruned && docker network prune -f && echo network pruned
make start
```


