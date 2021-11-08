# Initial Setup for Windows 10 Users
On Windows 10, the recommendation is to use the Windows Subsystem for Linux (WSL). To setup WSL and install the prerequisite software, follow these steps:

## 1) Setup WSL
The latest version of WSL is also known as WSL2. Setup WSL2 following the guide here: https://docs.microsoft.com/en-us/windows/wsl/install-win10. Pick **Ubuntu** as the chosen distro.

After installing Ubuntu, note the version number:
```
$ lsb_release -a
Release:        20.04
```
You will use this version number to tailor further install instructions later on.

## 2) Clone Baseline GitHub Repo
On the GitHub website, fork the repo `https://github.com/ethereum-oasis/baseline` into your own account. Then clone the fork you just made:
```
$ cd /home/(your ubuntu username)
$ git clone https://github.com/(your github username)/baseline.git
```

## 3) Install Node.js and npm
Follow these instructions to install Node.js and npm. Notice that near the top of the instructions there is a dropdown and you can pick your exact Ubuntu version. For Ubuntu version `20.04` (the version you collected in step 1) the URL is this:

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04

## 4) Install Docker
Follow these instructions to install Docker:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04.

There are version-specific instructions available in the same way as the previous step. Note that in these instructions the command `sudo systemctl start docker` will not work, [because WSL2 does not support systemctl](https://github.com/MicrosoftDocs/WSL/issues/457#issuecomment-511495846).

Instead of using `sudo systemctl start docker` use `sudo /etc/init.d/docker start`. Similarly you can check Docker status with:
```
$ sudo /etc/init.d/docker status
* Docker is running
```

## 5) Add User to the Docker Group
You must add your username to the docker group like this:
```
$ sudo usermod -aG docker (your ubuntu username)
$ su - (your ubuntu username)
```
Check that it has worked like this, you should see the group `docker` in the list:
```
$ id -nG
adm plugdev netdev docker
```
IF you don't do this step, you will get errors during Quickstart saying that docker is not available.

## 6) Install docker-compose
Follow instructions here, with version-specific variants available as before:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

## 7) Complete
You can now return to the [Quickstart instructions](README.md#quickstart).

If you are new to WSL there are some additional commands you may find handy:

#### Managing WSL
Start Powershell (not Powershell x86)  as admin and use:

 * `> wsl --shutdown` to shutdown all WSLs

 * `> wsl -l -v` to show status of all WSLs.

To access your Windows filesystem from WSL look in directory `/mnt/c`. Note however that if you've cloned the baseline repo using Windows tools into the Windows filesystem, you will still need to clone it into the Linux filesystem (step 2 above) to successfully run the Quickstart. 

#### Docker Information
During Quickstart, many Docker containers are built. You can follow progress by opening a new Ubuntu terminal (shift-click on the Ubuntu icon in taskbar) and periodically typing `$ docker info` to see high level info with how many containers are running, and `$ docker ps` to check container health.


