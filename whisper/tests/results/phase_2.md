# Phase 2: Testing on Public Mainnet

## Overview

On the public Ethereum network, create a managed Whisper network consisting of a full node peered to two light clients. Test the performance of whisper message delivery.

### Assumptions

- Repurposes tests in previous testing setup
- Similar metrics to phase 1 but with a more complicated setup and network
- Whisper full node is running on AWS

### Acceptance

- Metrics collected

![image](https://user-images.githubusercontent.com/35908605/66845869-d9a52380-ef3e-11e9-9698-3634df5c7335.png)

## Test Setup
- One full geth node (Whisper enabled, peered to light nodes, running in AWS N. Va.)
- Two light geth nodes (Whisper enabled, running on local developer machine)
- PoW target: 0.2 (default for geth Whisper clients)
- Message TTL (time-to-live): 10sec

## Step 1: 1000 messages per run
The first set of tests mirrors `Step 1` in https://github.com/eyblockchain/radish-34/issues/171.

Delay (ms) | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Run 6 | Run 7 | Run 8 | Run 9 | Average | Std. Dev.
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
100 | 323 | 437 | 373 | 375 | 438 | 466 | 485 | 380 | 384 | 406.8 | 52.3
80 | 366 | 358 | 352 | 344 | 452 | 473 | 565 | 463 | 424 | 421.9 | 74.0
50 | 386 | 360 | 370 | 383 | 362 | 354 | 360 | 407 | 400 | 375.8 | 19.1
25 | 381 | 386 | 360 | 378 | 393 | 366 | 356 | 387 | 399 | 378.4 | 14.9
10 | 429 | 414 | 418 | 416 | 388 | 395 | 388 | 413 | 420 | 409.0 | 14.9
7 | 399 | 393 | 410 | 383 | 416 | 404 | 388 | 421 | 421 | 403.9 | 14.1
6 | 404 | 391 | 422 | 383 | 399 | 395 | 409 | 428 | 444 | 408.3 | 19.6
5 | 401 | 431 | 399 | 393 | 402 | 376 | 420 | 424 | 419 | 407.2 | 17.5
4 | 408 | 402 | 383 | 393 | 383 | 382 | 411 | 439 | 429 | 403.3 | 20.6
3 | 427 | 459 | 381 | 409 | 409 | 382 | 390 | 460 | 587 | 433.8 | 64.7
2 | 428 | 407 | 395 | 571 | 476 | 600 | 554 | 444 | 482 | 484.1 | 74.6
1 | 735 | 687 | 685 | 704 | 747 | 812 | 931 | 740 | 541 | 731.3 | 104.8

> Note: values in the table above are delivery time averages for the fastest 99% of messages. All values in the table are in milliseconds (ms)

The delivery time appears to increase for delay settings below 4ms.

## Step 2: 10,000 messages per run
The results from `Step 1` indicate that our maximum sustained throughput occurred with a delay setting between 10ms and 4ms. The table in `Step 1 shows that delivery times increased with delay settings of 3ms or less. In order to give ourselves more confidence in those results, we increased the number of messages from 1000 to 10,000 and re-ran the tests, focusing on delay settings 25ms to 1ms.

Delay (ms) | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Run 6 | Run 7 | Average
-- | -- | -- | -- | -- | -- | -- | -- | --
25 |   |   |   |   |   | 433 | 402 | 417.5
10 | 494 | 503 | 475 | 478 | 490 | 466 | 444 | 478.6
7 | 496 | 499 | 477 | 469 | 477 | 444 | 448 | 472.9
6 | 501 | 513 | 488 | 483 | 488 | 472 | 469 | 487.7
5 | 517 | 487 | 475 | 469 | 461 | 458 | 437 | 472.0
4 | 526 | 504 | 487 | 475 | 468 | 443 | 596 | 499.9
3 | 526 | 491 | 505 | 474 | 487 | 449 | 446 | 482.6
2 | 533 | 497 | 491 | 540 | 476 | 491 | 464 | 498.9
1 |   |   |   |   | 548 | 526 | 514 | 529.3

Unfortunately, the results in this step do not indicate the delay setting where delivery time definitively increases. We can see that 1ms delay produces the slowest average delivery time, but `Step 1` above indicated that the minimum average delivery time was achieved with higher delay settings. These results are much harder to interpret than https://github.com/eyblockchain/radish-34/issues/171. 

## Step 3: 10,000 messages per run
I ran a few more runs of 10,000 messages, this time for delay settings of 35ms to 10ms. I wanted to see if this would help clear up the results in `Step 2`.

Delay (ms) | Run 1 | Run 2 | Average
-- | -- | -- | --
35 | 392 | 564 | 478.0
30 | 377 | 546 | 461.5
25 | 370 | 352 | 361.0
20 | 385 | 356 | 370.5
15 | 536 | 368 | 452.0
10 | 658 | 528 | 593.0

Unfortunately, it is still difficult to pinpoint the delay setting where average delivery time increases using this data.

## Conclusions
There were no dropped messages for any test runs above. `Step 1` indicates the minimum average delivery time was achieved with delay settings of 4ms or greater. However, data in `Step 2` and `Step 3` do not necessarily agree.

The increased variance in results in this test setup compared to https://github.com/eyblockchain/radish-34/issues/171 could be attributed to the increased complexity using the mainnet. The full node running in AWS was constantly importing blocks and peering to >10 other nodes at the time of testing. Perhaps those activities caused the node to sometimes limit the amount of processing power it could dedicate to forwarding Whisper messages. 

In `Step 3` a delay setting of 20ms yielded the lowest average delivery times. This might be conservative considering the data in `Step 1`, but seems to be the best estimate at this point without a larger data set. Maximum sustained throughput was calculated below.
- Sustained throughput: 1/(0.02 sec per message) = **50 messages per second**
- Average delivery time: **370ms**
  - Using the result from `Step 3`. The consistency of this number should not be trusted without further testing.
- Delivery % (messages received/messages sent * 100): **100%**

Overall I think these tests prove that Whisper can be used for messaging in Radish34. If we were more concerned about high throughput and scalability then I think more tests would be needed.