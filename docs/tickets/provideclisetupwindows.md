## Windows Instructions
Provided on: docs.provide.services
Windows Specifications:

Edition Windows 10 Home
Version 1909
Installed on 3/8/2020
OS build 18363.1139

1. git clone git@github.com:provideplatform/provide-cli.git
cd provide-cli
mkdir -p ~go
Ensure your enviroment is setup correctly.
set GOPATH=$HOME/go
set "PATH=$GOPATH/bin"
You will probably want to add the above path exports to your ~/.zshrc or equivalent.
go build ./...
go install ./...

rm ~\go\bin\prvd.exe
mv ~\go\bin\provide-cli.exe ~\go\bin\prvd.exe

Authentication
Once you have completed the setup and installed the CLI, the next step is to authenticate yourself, so that you can begin to interact with the Provide CLI and start interacting with the Provide Stack.

Create a new user if you have not already done so:

prvd users create
Once that process is complete, you should authenticate:

prvd authenticate
Enter your username and password:

prvd organizations init
prvd organizations list
prvd api_tokens init --organization 04793d07-888e-4863-b6fa-17900e63f663 --offline-access
prvd baseline workgroups init
prvd baseline workgroups participants invite

Windows Instruction's Stop at Participating Organization page 