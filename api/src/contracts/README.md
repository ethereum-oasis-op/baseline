# Explain this folder

Each contract is broken down into it's own folder to isolate functionality and make it easier to reason about

- contractName/deploy
- contractName/events
- contractName/methods

Question1: Why not just use ethers.js and the artifact to interact?
Answer1: We need the opportunity to deploy in a certain way if we have to, or to make extra calls prior to calling a method or listening for an event.

Question1: Why have deploy, events and methods in their own files?
