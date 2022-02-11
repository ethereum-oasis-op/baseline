# BPI Monolith Test Suite

## Project Description

As a first step in building a standard-based, open-source Baseline Protocol Implementation (BPI), we implemented a set of tests running against a simple mock BPI with well-defined interfaces and component boundaries. This test suite is implemented in such a way that it easy to run for a developer and it should serve as a entry point to get to know the protocol as well as a starting point to build a backlog of small, atomic tasks that can be picked up by core devs towards building a full-blown, open-source BPI.

BPI monolith is implemented using Typescript. Test framework used is Mocha together with Chai for assertions.

## Motivation

At the moment, there are no open-source BPIs that can serve for core dev onboarding and as a reference for further development of the protocol. We want to start working towards resolving this by building a simple, high-level abstraction of a BPI, based on the standards and described by a set of tests documenting the core functionalities of the protocol.

## How to run the tests

* Install [Node LTS](https://nodejs.org/en/)
* npm install
* npm run test

## How to participate

Team is working on creating a set of small, atomic and independent tasks that can be picked up by a dev trying to get into the protocol. You can see the current list of tasks [here](https://github.com/eea-oasis/baseline/projects/2) and express your interest in the [Baseline Slack](https://join.slack.com/t/ethereum-baseline/shared_invite/zt-d6emqeci-bjzBsXBqK4D7tBTZ40AEfQ) #devs channel.