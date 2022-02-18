# Shuttle-Excel

Shuttle-Excel is a connector for Microsoft Excel that allows Excel sheets to connect with the Baseline Protocol stack.

## Pre-requirements

1. Install the Provide-CLI. For detailed instructions, go [here](https://docs.provide.services/api/quickstart/cli-quickstart).
2. Install the local Baseline Protocol stack. For detailed instructions, go [here](https://docs.provide.services/api/quickstart/baseline).

## Installation

Clone the Baseline Protocol [repo](https://github.com/eea-oasis/baseline). The Excel-Addin is located in the baseline/examples/bri-1/lib/excel-connector. Go to the folder and run the following command to install all the node modules.

```bash
npm i
```

## Usage

In a terminal window, go to the provide-cli folder and start the local Baseline stack.

```bash
cd provide-cli
prvd authenticate
prvd baseline stack run
```

In a new terminal window, go to the baseline/examples/bri-1/lib/excel-connector folder and run the following command. This will open up an Excel sheet with the Excel Addin.

```bash
npm start
```

![Screenshot 2021-09-14 at 8 51 59 PM](https://user-images.githubusercontent.com/5380018/133286053-b804aa90-0a68-4d4c-9948-3276ece52711.png)
_Shuttle-Excel login page_

![Screenshot 2021-09-14 at 8 53 25 PM](https://user-images.githubusercontent.com/5380018/133286305-4e7394ec-fac8-4b52-98f0-36ba2851f94a.png)
_Workgroup list of current user_

![Screenshot 2021-09-14 at 8 54 19 PM](https://user-images.githubusercontent.com/5380018/133286465-d3823ee3-d86f-4534-b226-c1362140163d.png)
_Create new mapping for the Excel sheet. Mappings are required for synchronising with counterparts._
