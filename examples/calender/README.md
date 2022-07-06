# Grant Application for BLIP Bounty Hunt
Grant applications are completed by individuals or teams to propose allocation of Baseline grant funds to a specific project. 
This template is tailored to the 6-week duration of the [BLIP Bounty Hunt](https://sites.google.com/oasis-open.org/amsterbased2022/blip-bounty-hunt).

The grant application has been approved if a majority (6 or more) of the [Technical Steering Committee members](https://docs.baseline-protocol.org/governance/technical-steering-committee) upvote this application (thumbs up), and a community manager updates the label to 'approved'.

If approved, add your project to the ['Approved Grants' list here](https://github.com/eea-oasis/baseline-grants/blob/main/Approved-Grants-2022.md) to signify commitment to the work.

---

## Applicant Background
Name of person or team submitting the grant request, (optionally) with background and experience.


**Vaibhav Maheshwari**

I have been a solidity developer and bounty hunter for multiple projects namely- Ricochet Exchange, Zesty Marketplace, Vite.js, Zilliqa, Matchbox DAO. I graduated from NIT Surat in 2020 with degree in applied mathematics. I love to work on difficult problems that help me grow and allow me to work on exciting technology. 

---

## Associated BLIP
Give name of associated BLIP with a hyperlink.

[Baseline Calender](https://github.com/eea-oasis/baseline-blips/issues/24)
---

## Details on Grant Work
(Describe your proposed work in greater detail)


The idea is to have a smart contract which will store a mapping that have addresses against available time / default available time of the address. This would then be matched with other address's availability and most recent time slot would be alloted to both the parties. 
There would also be a beautiful UI which would allow users to set availability times and match it with other addresses given that they have allowed them to do so. 

### Tech Stack
- [ ] ReactJS (frontend)
- [ ] ExpressJS (backend)
- [ ] Blockchain (Gananche)
- [ ] Zero Knowledge Proof verifier (Circom + SnarkJS)
- [ ] (optional) Kafka Pub / Sub to verify proof whenever seeker sends and confirm it (not necessary, only to make it real time, can be done via APIs)

Lets' say there are two people, appointment Seeker (sk) [the person who is seeking an appointment]  and interview lister [the person who is listing the interview that is sharing their calendly links in more traditional sense] 

Here is how it would work, 

- lister lists the available time slots 
- lister shares the link publicly
- seeker signs in on the link available 
- seeker selects multiple times that he / she is available 
- seeker uses appointment time, and address to generate proof
- seeker sends proof to lister 
- lister verfies the proof with two outcomes - appointment scheduled or appointment denied. 

---

## Deliverables / Schedule / Milestones
Provide information on the final deliverables, proposed schedule, and milestones followed to complete the work.


**Milestone 1** (30%)
Create a frontend which would be pleasing and appealing to the end user. Mainly 4 pages would be present in the entire application, 
- [ ] Home Page with community links
- [ ] App Page with connect wallets 
- [ ] Set time availability default 
- [ ] Set appointment with someone

**Milestone 2** (30%)
Create smart contract which would have time availability in encrypted format and matching can happen for two different addresses. 

**Milestone 3** (30%)
Create the circuit (circom) and use SNARK.JS to create a way to verify. 

**Milestone 4** (10%)
Testing of the contracts, documentation of the project. 



---

## Budget and Justification
Provide proposed amount that should be paid (in USD) for the grant work, with detailed justification.
Feel free to use suggested amount provided in the BLIP, or adjust according to the scope of your proposed project.


**6000$**
The proposed work would require serious developer hours and would need time and effort to justify the 6000$. 


---

### Community Grant Agreement 
I understand and agree to the [BLIP Bounty Hunt Terms & Conditions](https://github.com/eea-oasis/baseline-blips/blob/main/BLIP-Bounty-Hunt-Terms.md) and the ['Process for Approved Grants' outlined here](https://github.com/eea-oasis/baseline-grants/blob/main/README.md)
(Items #7 and #8 under the 'Process for Approved Grants' list do not apply for the Bounty Hunt work given the shortened duration, instead bi-weekly updates are required as a comment under this grant request.
- [ ] I agree 
- [ ] I do not agree

### Questions?
Email the team at baseline-team@oasis-open.org or [message in the BLIP Bounty Hunt Discord](https://discord.gg/gHSHAPKTb7)
