# Contributors Guide

All work of the Baseline Protocol initiative is maintained publicly at: [https://github.com/ethereum-oasis/baseline](https://github.com/ethereum-oasis/baseline)

You don't need any special access to the [repo ](https://github.com/ethereum-oasis/baseline) to get involved and start contributing.  Follow these steps to [fork](contributors-guide.md#submitting-a-pull-request) the repo and submit pull requests. Anyone with a Github ID can also create and edit their own Issues, participate in public meetings, and join the various communication and collaboration [channels](community.md#connecting-with-each-other-directly) that the community maintains.

There are four ways to contribute: 

* Write code \(Architecture, Spikes, Issues, Tasks\)
* Write specifications \(Epics, Stories, [Standards](../baseline-protocol/standards/), Prioritizations, Use Cases\)
* Write content and communicate it to more potential contributors, developers and product owners, and other stakeholders -- Join the [communications team](https://ethereum-baseline.slack.com/archives/C011NCZ2ES1) on Slack
* Help prioritize work and develop incentives to get it done by joining the [SSC]() or becoming a [Maintainer]() or [TSC]() Member.

There is one other way to contribute, and it's the most important: **use the work in the Baseline Protocol to improve your own offerings**. The Baseline Protocol is not a product or platform..**the product is YOUR product**. 

## Code of Conduct

{% embed url="https://github.com/ethereum-oasis/baseline/blob/master/CODE\_OF\_CONDUCT.md" caption="Code of Conduct" %}

## Technical Contributors

Technical contributors either are working on architecture or developing code...but even correcting the language of in-line docs counts as a technical contribution and qualifies you to vote in upcoming [TSC](community-members.md#your-technical-steering-committee) elections.

### Issues Organization and Community "Sprints"

Technical tasks are written as Github Issues. Issues will be reviewed, lightly prioritized, and communicated as "hey, help out here!" messaging to the developer community every two weeks. The TSC will periodically review what Issues and communications best succeeded in attracting help.

An Issue should be constructed, in particular, with acceptance tests. All other elements of a good Issue should be known to any practicing developer. 

Most Issues should be attached to an Epic \(see below\).

A good Task/Issue starts with a Verb: "Implement xyz."

### Submitting a pull request

Follow these steps when submitting a pull request:

1. Fork the repo into your GitHub account. Read more about forking a repo on Github [here](https://help.github.com/articles/fork-a-repo/).
2. Create a new branch, based on the `master` branch, with a name that concisely describes what you’re working on \(ex. `add-mysql`\).
3. Ensure that your changes do not cause any existing tests to fail.
4. Submit a pull request against the `master` branch.

Good practice strongly favors committing work frequently and not loading up a long period of work in isolation. Be brave...let others see what you are working on, even if it isn't "ready."

### eCLA and iCLA

Anyone can do a pull request and commit. In order for your work to be merged, you will need to sign the eCLA \(entity contributor agreement\) or iCLA \(individual contributor agreement\). Here are the details: [https://www.oasis-open.org/resources/projects/cla/projects-entity-cla](https://www.oasis-open.org/resources/projects/cla/projects-entity-cla)

The iCLA happens automatically when people submit a pull request, or they can access directly by going to [https://cla-assistant.io/ethereum-oasis/baseline](https://cla-assistant.io/ethereum-oasis/baseline)

### Maintainers and Commit Rules

During the bootstrap phase \(March - June, 2020\) merging to Master will require review by THREE Maintainers. The TSC will seed the set of Maintainers. Thereafter, any active Member can become a Maintainer. Maintainers may add more Maintainers by two-thirds majority \(rough consensus rules\), and the TSC may step in to resolve cases where this process fails. 

## Specifications Contributors

The specifications work of the community can be done by anyone, both technical and non-technical contributors. The focus is on finding evidence for a requirement and articulating it in the form below. The [SSC](community-members.md#your-specifications-steering-committee) is the coordinating body for this work.

### Epics and Stories Organization

The Baseline Protocol initiative uses [Zenhub](https://app.zenhub.com/workspaces/baseline-5e713dc4f555144d9d6d17f6/roadmap) to create and manage both [specification](https://github.com/ethereum-oasis/baseline/tree/master/radish34/ui#workspaces/baseline-5e713dc4f555144d9d6d17f6/roadmap?repos=239590893) work and active protocol requirements and prioritization. \(Zenhub should be a tab in your Github interface if you are using the [Chrome extension](https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd?hl=en-US). There is also a web-app [here](https://app.zenhub.com/workspaces/baseline-5e713dc4f555144d9d6d17f6/roadmap).\)

Zenhub enables Epics to nest, while Issues don't nest...not really.  Therefore, the community will employ the practice of using Issues for engineering Tasks and Epics to contain high level topics, which may have nested within them a set of agile Epics, and in them a set of Stories, and even Stories may have other Stories nested in them.  Engineering meets planning where a Story \(in the form of a Zenhub Epic\) is referenced by an Issue/Task. \(This can work very well, but Zenhub's choice in calling Epics, _Epics_ can cause confusion.

### A Good Story

A Zenhub "Epic" used as a high-level container for a grouping of work should be in short topic form -- primarily nouns.

A Zenhub "Epic" used as a Story should almost always follow the form: "As X, I need Y so that I can Z."  An acceptable variant is the "now I can" form \(note the "so that" clause is preserved\): 

* [ ] A  Party's System Administrator can look up Counterparties in an OrgRegistry \(a public phone book\) and add them to a Workgroup, so that they can start Baselining Records and Workflows.
* [ ] A Party's System Administrator can quickly and easily verify a Counterparty's identity found in the OrgRegistry, so that they can be confident in adding the Counterparty to a Workgroup.
* [ ] A Party's System Administrator can use some or all of the Counterparities and Workflow Steps defined in one Workgroup in Workflow Steps created within another Workgroup, so that Workgroups don't become yet another kind of silo. 



