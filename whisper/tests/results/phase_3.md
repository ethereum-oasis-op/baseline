# Phase 3: Testing on Public Mainnet, cross-country

## Overview

Using the same testing process as phase 2, except light clients are peered to different Docker full nodes on the public Ethereum mainnet. 

### Assumptions

- Two Docker full nodes are peered to each other
- Expect greater latency than phase 2 since we are introducing an extra hop for Whisper messages to travel before reaching destination

### Acceptance

- Metrics on delivery
- Summary of public network

![image](https://user-images.githubusercontent.com/35908605/66846316-a747f600-ef3f-11e9-9c5e-0edf1b57bde9.png)

## Test Setup
- Two full geth nodes (Whisper enabled, peered to each other)
  - One in AWS N. Va., peered to light node A
  - One in AWS Oregon, peered to light node B
- Two light geth nodes (Whisper enabled, running on local developer machine)
- PoW target: 0.2 (default for geth Whisper clients)
- Message TTL (time-to-live): 10sec

## Step 1: 1000 messages per run
This set of tests mirrors `Step 1` in https://github.com/eyblockchain/radish-34/issues/171.

Delay (ms) | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Run 6 | Run 7 | Run 8 | Run 9 | Run 10 | Average | Std. Dev.
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
500 | 1090 | 949 | 1021 | 1310 | 1066 | 875 | 842 | 1027 | 862 | 727 | 1004.7 | 163.7
100 | 697 | 804 | 1019 | 1570 | 1329 | 935 | 668 | 1424 | 588 | 1055 | 1003.8 | 338.3
50 | 695 | 1489 | 945 | 1043 | 917 | 1371 | 1484 | 843 | 3696 | 602 | 1387.0 | 895.4
10 | 738 | 702 | 968 | 973 | 931 | 944 | 830 | 3691 | 1019 | 926 | 1199.6 | 891.1
5 | 815 | 976 | 1262 | 1010 | 2596 | 931 | 866 | 960 | 956 | 2022 | 1152.4 | 591.5
Dropped | 0 | 1 | 0 | 11 | 0 | 0 | 0 | 0 | 22 | 0 |   |  

The bottom row of the table above shows how many messages were sent but not received by `light node B`. Increasing the TTL above 10 seconds likely would have allowed all messages to reach the destination, but would have increased the average delivery time.

## Conclusion
As with the mainnet tests in https://github.com/eyblockchain/radish-34/issues/172, this data shows high variance. We can see a wide range of average delivery times even when the delay between messages remains fixed. 

Delay (ms) | Phase 3 | Phase 2 | Diff.
-- | -- | -- | --
100 | 1003.8 | 406.8 | 597.0
50 | 1387.0 | 375.8 | 1011.2
10 | 1199.6 | 409.0 | 790.6
5 | 1152.4 | 407.2 | 745.2

The table above indicates an extra hop for Whisper messages to travel in these tests compared to `Phase 2` (https://github.com/eyblockchain/radish-34/issues/172) increased the average delivery time by at least **~600ms**.