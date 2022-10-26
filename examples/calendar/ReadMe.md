## Problem Statement

Right now when we use calendly, it has gives access to the scheduler and what times they are available. Caldendly also shows the times the person is not available. You have to trust this central authority to ensure proper scheduling takes place.Baseline Calendar uses Zero Knowledge Proof to ensure that privacy of user is mantained. This matching of time availability happens on client side which generates a proof which is then verified by the setter (to make sure incorrect information is not passed around) 

## Basic Flow

![Flow](https://i.imgur.com/JsJeEuN.png)
There are two parties giver (giving appointment) and seeker (seeking appointment). The giver (as the name suggests) gives the appointment link
to the seeker.

-   Store available times of the giver (giving appointment) in our database (availability)
-   Now the giver can share the link to seeker
-   The seeker chooses 3 time slots that they are available. When the appointment is successful, it generates the proof.
-   The giver verifies the proof and the appointment is finally confirmed to be at that time.

## Main idea.

With help of merkle trees we can prove that one the nodes has a certain root without revealing the nodes. So if we have the merkle root and the node,then we can prove existance (merkle tree) or inexistance (sparse merkle trees). If changes in nodes of merkle tree would change the root.

In this case, we need to prove that person A and person B are scheduled for an appointment without revealing their individual commitments to each other
(more than they need to know).

## Tech Stack

-   NodeJS for API creation
-   PostgresDB for database purpose
-   Circom2 and SNARKJS for proof generation / verification
-   ReactJS for frontend

## Circuit Working

![Circuit](https://i.imgur.com/n9eKQAx.png)

## How to run this project?

You can use the following commands to run the code for backend and frontend.

### YARN

```
yarn install
yarn start
```

### NPM

```
npm install .
npm start
```

### Backend Tasks

-   [x] User Creation API
-   [x] User Authentication API
-   [x] Fetch user via ID API
-   [x] User Set Time Availability API
-   [x] Schedule Appointment API

### Privacy Tasks

-   [x] Circom proof to verify appointment times
-   [x] Setup [Ceremony of Tau]
-   [x] Prove (SnarkJS) with wasm / custom input.json
-   [x] Solidity Smart contracts consumption via API [proof]
-   [x] Solidity Smart contracts consumption via API [verify]

### Frontend Tasks

-   [x] Create Login Page
-   [x] Create Scheduling Page
-   [x] Set an appointment
-   [x] Appointment Page

### Demo Video
[Demo Video](https://www.youtube.com/watch?v=_eVsyjWFXhw)
### Credits

The authentication starter has been used from (https://github.com/amaurym/login-with-metamask-demo), which has been licensed under the MIT License which allows the use of code for commercial / non commercial use and is open to modify and redistribute for free.
