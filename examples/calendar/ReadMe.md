## Problem Statement

Right now when we use calendly, it has gives access to the scheduler and what times they are not available. This might be an issue for folks are serious
about privacy of their

## Basic Flow

![Flow](https://i.imgur.com/JsJeEuN.png)
There are two parties giver (giving appointment) and seeker (seeking appointment). The giver (as the name suggests) gives the appointment link
to the seeker.

-   Store available times of the giver (giving appointment) in our database (availability)
-   Now the giver can share the link to seeker
-   The seeker chooses 3 time slots that they are available. When the appointment is successful, it generates the proof.
-   The giver verifies the proof and the appointment is finally confirmed to be at that time.

## Main idea.

With help of merkle trees we can prove that one the nodes has a certain root without revealing the nodes. So if we have the merkle root and the node,
then we can prove existance (merkle tree) or inexistance (sparse merkle trees). If changes in nodes of merkle tree would change the root.

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

<<<<<<< HEAD
-   [x] User Creation API
-   [x] User Authentication API
-   [x] Fetch user via ID API
-   [x] User Set Time Availability API
-   [x] Schedule Appointment API
=======
- [x] User Creation API
- [x] User Authentication API
- [x] Fetch user via ID API
- [x] User Set Time Availability API
- [ ] Schedule Appointment API
>>>>>>> 3eeadcce43d6b090ffe576edb27c8c5a12a0c0d9

### Privacy Tasks

-   [x] Circom proof to verify appointment times
-   [x] Setup [Ceremony of Tau]
-   [x] Prove (SnarkJS) with wasm / custom input.json
-   [x] Solidity Smart contracts consumption via API [proof]
-   [x] Solidity Smart contracts consumption via API [verify]

### Frontend Tasks

-   [x] Create Login Page
-   [x] Create Scheduling Page
-   [ ] Set an appointment
-   [ ] Appointment Page

### Credits

The authentication starter has been used from (https://github.com/amaurym/login-with-metamask-demo), which has been licensed under the MIT License which allows the use of code for commercial / non commercial use and is open to modify and redistribute for free.
