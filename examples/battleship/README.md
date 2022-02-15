# Battleship Baseline 

## Quickstart
Installation and operating instructions.

In order to experience Baseline for the very first time, you’ll need to perform bare minimum installations on your machine

VS Code or any of your favorite IDE
[Docker](https://docs.docker.com/get-docker/ )
[Docker compose](https://docs.docker.com/compose/install/ ) 
[git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git )

Once you have these installed, clone the official repo [Baseline repo](https://github.com/eea-oasis/baseline) and have it added to your local working directory

Navigate to the following path 
```
/examples/battleship/ops
```
 From here, run the `run.sh` script, which will start following containers:
1. Kafka with zookeeper, for messaging (script will also add needed topics)
2. Ganache-cli
3. BPI (Baseline Protocol Implementation) for both players
4. Front end client for both players

Give it a few seconds to download all the dependencies, and once done it will trigger two running instances on ports 8080 and 8081 (by default), each imitating a counterparty participant in the game. 

Note: If ports 8080 and 8081 are already being used in your machine for some other program, feel free to modify the ports in the docker-compose file.

To clean up you can run `clean.sh` script. 

## Technical details: 
This section breaks down the technical aspects of the Battleship Baseline implementation. 

### Tech stack: 
The team utilized the following technologies 

Component
Technologies
Front end
ReactJS
Back end
ExpressJS
Application Messaging
Kafka
Client - server messaging
Socket.io
Blockchain
Ganache 
Zero Knowledge Proof verifier
Circom + SnarkJS

### How Baselining the battleship was achieved: 

A common workgroup is created for the players/counterparties, and replicated on both players memory stores using Kafka
The players or organizations begin the game by joining this common workgroup
Upon joining the workgroup, these players can then start placing ships on the board
One of the two players place their ship, which is notified in Real-Time to the other player using Kafka stream
Once both of the players have placed their ships, they can then take turns trying to hit opponent ship
For example, turn has following steps:
- player 1 targets location of player 2 ship
- player 2 receives target coordinates using kafka
- player 2 uses target coordinates, board hash (circuit public inputs) and ship position (circuit private inputs) to generate proof
- player 2 sends proof back to player 1
- player 1 verifies the proof, using proof and public inputs
the verify step can have two outcomes : 
a) HIT : the ship was placed at the coordinates where the other player has placed their ship
b) MISS : the ship was placed in an empty area
Once verification is successful, new leaf containing hash of turn information is stored in merkle tree

### A Note About Messaging – NATs vs KAFKA: 

The official Baseline protocol documentation recommends NATs messaging protocol in order to share the messages across organizations. We have expanded this even further with implementing a Kafka based message provider that can help the exchange of messages in real time. The concept remains the same, the players/counterparties participating in the battleship game will join and subscribe to a common topic created for these players. As and when the players make a move, the information is passed over to the Kafka stream, which is then read for the input message. The idea of using Kafka for this implementation is just to showcase the interoperability of Baseline protocol across different messaging providers like NATs, MQTT, AMQP, etc. One real benefit with Kafka, besides processing bulk messages in no time, is that Kafka can be easily integrated with DIDComm and hence opens up even more possibilities to explore.
Understanding the Use and Implementation of Zero Knowledge Proofs in the Battleship Baseline Game
[Zero Knowledge](https://en.wikipedia.org/wiki/Zero-knowledge_proof ) is based on a lot of “scary” math, but thanks to tools like snark, gnark, and more libraries coming out to make short work of common use cases, implementing it in a baselined project is not as hard as you might think…and it is getting easier every day. For the purpose of the battleship implementation, we have used [Circom2](https://github.com/iden3/circom) – for writing and compiling the circuit; and [snarkjs](https://github.com/iden3/snarkjs) – for generating and validating proofs. We welcome teams to change the current implementation to utilize [gnark](https://docs.gnark.consensys.net/en/latest/) which is an open-source GO library to help the establish trust in a blockchain environment when we don’t really want to expose the data, but still exchange the data across/between parties.
Meet the Baseline Protocol Core Devs behind Battleship Baseline (in alphabetical order)

## Functional / Implementation Details: 
This section breaks down the functional aspects of Battleship Baseline and the value it adds. 

## The Baseline Protocol
Baselining is the practice of using zero knowledge cryptography techniques to prove that counterparties maintain the same information in their respective systems of record, and to prove attributes of that information to third parties, without revealing the actual information.

The practice is essential for greater coordination between companies, because companies today must work together more closely than ever before, but they’ve never been so aware of the risks of leaking information between entities. The world needs a way to increase coordination, while also increasing compliance (by reducing information security risks otherwise posed by that level of coordination), to transform its balkanized, bespoke and brittle patchwork of information systems.

Say hello the the Baseline Protocol - for more information, [see here](https://baseline-protocol.org )

Before baselining transforms the world of industry, developers need to get used to the approach, making it important to get started with something simple, like a game. And ideally a game that’s easy to implement, easy to create new features for (best way to learn), and easy to see how it mirrors the real world implementation. 

## Battleship: Baseline
‘Battleship Baseline’ is an implementation of the classic search & destroy strategy guessing game, using the design pattern specified in the Baseline Protocol standard. This implementation is a great way to start baselining. It gives you a simple framework of where and how to baseline information between multiple parties, a complete set of code that works, and a lot of clues on how to extend the code to create new features and for other use cases. 

## Demo
[See the demo here](https://www.youtube.com/watch?v=qyqqu2wNZe8)

## The Game
In ‘Battleship Baseline,’ players are ushered through a (fairly) standard game of Battleship framed entirely within a Baseline Protocol context. [See here](https://en.wikipedia.org/wiki/Battleship_(game)) for more information on the traditional game.

To keep this implementation simple and demonstrate the core aspects of baselining – proving consistency of shared information, and attributes of that information, without disclosing the actual data – the current code covers just two of the aspects of the full game: 
1) Setting up hidden positions of each player’s battleship (just one battleship for this version…again, for simplicity); 
2) Calling of grid positions and scoring hits or misses.  

So at the beginning of the game, Player 1 sets up a two-player baselined workgroup and invites Player 2 into it. Then each Player positions their battleship (length of 3) on their private 5x5 grid. Then Player 1 calls a grid position, like “E2”, Player 2 receives the message and responds with “Hit” or “Miss” back to Player 1. The baselined zero-knowledge circuit evaluates Player 2’s claim of “Hit” or “Miss” and allows Player 1 to be confident that the claim is true, without giving up anything to Player 1 about Player 2’s grid (or the position of their battleship). The magic of the baselined process here is that the game doesn’t require a server in the middle with full knowledge of both players’ state, to be the referee confirming hits and misses.
What Does This Simple Game Mean for Real World Baselining?
Battleship is a really good game to use as baselining’s “hello world,” because it succinctly makes the argument for when coordination without revealing information is important. Imagine you are playing the non-computer-based old-school Battleship game, but you are playing with a precocious eight-year-old cheater. You call “C4,” and the innocent cherub says, “miss!” Later, you call “C5” and the 8-year-old says, “you already called that.” You say, “no, I didn’t.” And now you are arguing with a child. Good times. This problem happens in business all the time. By error or outright cheating, counter-parties to complex workflows in supply chain to finance, from asset management to food safety, can either mistake “C4” for “C5” or conveniently misremember a previous state of play. 

The “battleship problem” is solved easily by turning the board game into a computer game run by a shared machine or an online server. Hits and misses are scored correctly and consistently without the machine revealing the location of the players’ battleships. Easy peasy. 

But in business, when the stakes are high, having a shared referee is risky, expensive and time-consuming. It would be far better if you could call “C4” and get back a “miss” or “hit,” and know for sure that the result was true, without having any other information about the whereabouts of your opponent’s ships and without having a shared machine or referee with full access to all the ship locations. This is what baselining aims to provide. 

One interesting detail about this Battleship example is that it represents a relatively rare case where you need to operate under zero knowledge just between two parties. In industry, you can throw a rock in nearly any direction and find a case where you could make things a lot better, and a lot more secure, if you could prove – without revealing actual data – that two parties have the same information, and that the information is both correct and follows some agreed-upon rule (like the price paid didn’t exceed some limit or the delivery occurred before some date), to some third party. But usually it’s assumed that two direct counter-parties are going to each have a copy of the actual data, usually because one of the parties generated the data and sent it via email, messaging system or carrier pigeon to the other party. For example, a supplier is going to send the actual invoice of a purchase to the buyer, and hopefully both of them store a copy of the same information. There might be an auditor or regulator or financier perhaps that needs a proof of something about that invoice without being allowed to see the actual data, and that’s a job for baselining, but the buyer and supplier themselves only need to be sure that they have the same information…and there are a variety of ways to do this more simply than using zk cryptography. 

That said, there are real-world cases of two party coordination where the “battleship problem” applies. One obvious one is the case of a logistics service that might have other business operations that compete with a company using them to ship a product. The logistics company may need proof that the product did not go through any restricted ports before they picked it up. Or they may need to have proof that the materials in the product have not come from illegal sources. It’s important in this case that the logistics company have as little information as possible about their competitor’s internal operations, while receiving the assurances needed to legally do their job. That’s a two-party battleship problem.

Regardless, the nice thing about the battleship example for baselining is that it can easily be extended from two players to multiple parties. You could, for example, extend the game to prove to a tournament which player won, and prove that both players agree to the same final state of the game in which one of them won, without revealing the details of the game beyond the original two players.  
Extending the Battleship Baseline Game
This implementation is very simple…as it should be. But here’s what it doesn’t do – and we invite you to a) make it do these things; b) think of new things for it to do that we haven’t thought of!

First, it doesn’t allow the Players to prove (or disprove) that the opponent has sunk the whole battleship. Perhaps Player 1 somehow managed to hack something to allow them to have a battleship of length 4 or length 2. How would you modify a zero knowledge circuit (or rather, add one) that proved whether or not the last grid call sunk or did not sink the battleship.

Second, the current implementation only allows the Players to have a single battleship. How would you modify it to permit multiple battleships? Or multiple battleships of various sizes?

Third, this implementation is just between two players. Elsewhere in this readme, we discuss that most real-world cases for baselining involve three or more parties, where two or more need to prove that they have the same information, and attributes of that information, to other parties, without revealing the actual data to those parties. So in the Battleship game, how might you implement it so that the whole game can prove to, say, a tournament organizer, that Player 1 won the game, and maybe how many turns it took, without revealing the actual grid data or battleship positions to the organizer?  
Modifying Battleship to Create New Baselined Solutions
As we’ve said, Battleship is just a good way to illustrate the essential parts of baselining: digital identities & signatures, multiparty secure messaging, database access & connectors, zero-knowledge circuits.  Any IT or development team can put together a baselined project, and the team that built Battleship proved that by building the entire implementation from scratch. We even taped most of our coding sessions, which you can watch here [get youtube links].

Take the setting up of the Player workgroup and their grids and battleship locations. For the Battleship implementation, we used simple in-memory services to store information about workgroups, organizations and games. One player creates a workgroup and then using kafka messaging, the workgroup is replicated on other player’s memory stores. Then, both players create organizations, and details of both organizations are stored on both sides. In a real world situation you would usually set up some permanent DBMS.  In our case we can improve by adding a database – say SAP or Mongo, or maybe a redis cache.


So to use the Battleship Baseline project to give you a leg up on your own project, do what you would normally do with example code:

[ Libraries to copy
Parts of the example code that can be modified in ways to, for example, add third parties.
Tips and tricks from the battleship team…things to watch out for. ]



| Name | LinkedIn |
|:--|:--|
|Daven Jones | https://www.linkedin.com/in/daven-jones-00327663/ |
Jack Proudfoot | https://www.linkedin.com/in/jacksonproudfoot/ |
Manik Jain | www.linkedin.com/in/manikjain7 |
Ryan Fisch | https://www.linkedin.com/in/ryanfisch/ |
Stefan Kostic | https://www.linkedin.com/in/stefan-kostic-b07147b8/ |



