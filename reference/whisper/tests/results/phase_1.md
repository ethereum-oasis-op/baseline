# Phase 1: Baseline metrics for Whisper messages

## Overview

So we can have a consistent and repeatable way to understand the performance of Whisper. Create a test script to use two whisper clients connecting to the same peer, exchange messages, and measure the performance.

### Assumptions

- In any language
- Using Docker (and compose)
- Local development environment

### Acceptance

- Metrics defined in Epic are captured
- Since this is a simple and controlled environment we expect to get really good results

![Blank Diagram (1)](https://user-images.githubusercontent.com/1624/66327802-6b86ae00-e8f9-11e9-82cf-8b83c5cc424b.png)

## Test Setup
- Consensus algorithm: Clique PoA
- One full geth node (miner, Whisper enabled, peered to light nodes)
- One full geth node (miner, Whisper enabled): minimum of two miners needed for PoA
- Two light geth nodes (Whisper enabled)
- PoW target: 0.2 (default for geth Whisper clients)
- Message TTL (time-to-live): 10sec

## Step 1: 1000 messages per run
In order to measure average delivery time, we first need to find out what is the maximum sustained throughput. Whisper's PoW for each message seems to be the biggest limiting factor for throughput. The more messages we try to send in succession, the more buildup in the Whisper client's message queue because it is having to compute a separate PoW for each message. Maximum sustained throughput will be determined by decreasing the `delay` between sending messages until the average delivery time starts increasing. If the PoW target is increased, the throughput would decrease.
> Note: messages are not delivered sequentially because the time to compute the PoW target varies even if the PoW target is the same for every message.

For this first set of tests 1000 messages were sent per run. The delay time between messages was varied and each delay setting was given 6 runs. The average delivery time for all runs for each delay setting is shown in the far right column.

Delay (ms) | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Run 6 | Average
-- | -- | -- | -- | -- | -- | -- | --
100 | 286 | 323 | 324 | 322 | 304 | 309 | 311.3
80 | 318 | 292 | 327 | 286 | 302 | 299 | 304.0
50 | 295 | 309 | 325 | 329 | 307 | 321 | 314.3
25 | 317 | 325 | 296 | 308 | 315 | 300 | 310.2
10 | 320 | 305 | 296 | 296 | 323 | 315 | 309.2
7 | 301 | 329 | 293 | 337 | 299 | 295 | 309.0
6 | 304 | 304 | 313 | 294 | 320 | 332 | 311.2
5 | 321 | 307 | 309 | 346 | 319 | 316 | 319.7
4 | 311 | 309 | 312 | 320 | 347 | 314 | 318.8
3 | 336 | 331 | 334 | 318 | 351 | 325 | 332.5
2 | 395 | 346 | 376 | 400 | 380 | 346 | 373.8
1 | 614 | 615 | 702 | 667 | 693 | 755 | 674.3

> Note: values in the table above are delivery time averages for the fastest 99% of messages. All values in the table are in milliseconds (ms)

## Step 2: 10,000 messages per run
The results from `Step 1` indicate that our maximum sustained throughput occurred with a delay setting between 10ms and 4ms. The table in `Step 1` clearly shows that delivery times increased with delay settings of 3ms or less. In order to give ourselves more confidence in those results, we increased the number of messages from 1000 to 10,000 and re-ran the tests, focusing just on delay settings 7ms to 2ms.

Delay (ms) | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Run 6 | Average
-- | -- | -- | -- | -- | -- | -- | --
7 | 315 | 300 | 337 | 317 | 313 | 333 | 319.2
6 | 329 | 321 | 326 | 312 | 309 | 300 | 316.2
5 | 314 | 329 | 328 | 317 | 324 | 334 | 324.3
4 | 323 | 312 | 310 | 323 | 329 | 311 | 318.0
3 | 350 | 327 | 358 | 346 | 330 | 358 | 344.8
2 | 466 | 412 | 452 | 675 | 474 | 474 | 492.2

## Conclusions
There were no dropped messages for any test runs above. The minimum average delivery time was achieved with delay settings of 4ms or greater. Using a conservative delay setting of 7ms equates, sustained throughput was calculated below.
- Sustained throughput: 1/(0.007 sec per message) = **142 messages per second**
- Average delivery time: **319ms**
- Delivery % (messages received/messages sent * 100): **100%**

