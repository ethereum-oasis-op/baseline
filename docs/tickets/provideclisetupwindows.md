## Windows Instructions
Provided on: docs.provide.services
Windows Specifications:

Edition Windows 10 Home
Version 1909
Installed on 3/8/2020
OS build 18363.1139

git clone git@github.com:provideplatform/provide-cli.git
cd provide-cli
mkdir -p ~go
set GOPATH=$HOME/go
set "PATH=$GOPATH/bin"
go build ./...
go install ./...
rm ~\go\bin\prvd.exe
mv ~\go\bin\provide-cli.exe ~\go\bin\prvd.exe
prvd users create
prvd authenticate
prvd organizations init
prvd organizations list
prvd api_tokens init --organization 04793d07-888e-4863-b6fa-17900e63f663 --offline-access
prvd baseline workgroups init
prvd baseline workgroups participants invite
Windows Instruction's Stop at Participating Organization page