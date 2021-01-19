## Local ERP Spreadsheet Link

https://docs.google.com/spreadsheets/d/1Z_DonR4P5T5xyjKODgDyyF3BgQG7eObodl8d1IWxS6s/edit#gid=6762577

## Running

## Commands used to deploy stuff

### Deploy updates cloud function 

`gcloud functions deploy sheets-update-incoming --runtime go111 --trigger-http --allow-unauthenticated --entry-point UpdateIncoming`

### Deploy send Proposal cloud function

`gcloud functions deploy sheets-send-proposals --runtime go111 --trigger-http --allow-unauthenticated --entry-point SendProposals`

### Deploy authentication cloud function

`gcloud functions deploy sheets-authenticate --runtime go111 --trigger-http --allow-unauthenticated --entry-point Authenticate`

### Pause Update Scheduled Task

`gcloud scheduler jobs pause SHEETS-UPDATE-INCOMING`

### Resume Update Scheduled Task

`gcloud scheduler jobs resume SHEETS-UPDATE-INCOMING`
