# Architecture Documents

This is where architecture documents for our projects & features will live. Not everything will
require an architecture document to be written and reviewed by a committee. However it should get
done when building new services, starting new projects, and even architecting complexing features of
existing projects.

## Contributing

- Please use the provided [TEMPLATE.md](TEMPLATE.md) when submitting a new architecture doc for
  review.
- Make sure you don't just copy & paste from the Github page, because there's hidden comments within
  the [TEMPLATE.md](TEMPLATE.md) to provide more guidance.
- Always use markdown.
- Choose an existing directory to place the new doc in or create a new project directory inside of
  `/architecture`.
- Directories should always be **totally lowercase with dashes separating words**.
- Document filenames should always be **totally lowercase with dashes separating words**.
- Every doc should be prefixed with a two digit number in order. If your doc is the first one in the
  section/project directory, you should name it `01-<name-with-dashes>.md`, i.e.
  `01-initial-radish34-architecture.md`.
- If the doc has relevant assets (images, pdfs, etc.) please create an assets dir named
  `architecture/<service>/<number>-assets/`. For instance:

  ```txt
  architecture/
  └── onboarding/
      ├── 04-onboarding/
      │   └── img.png
      └── 04-onboarding-arch-doc.md
  ```

- Architecture docs are a snapshot in time. They shouldn't be overwritten just because we might
  refactor a service or feature in the future. In those cases you should still create a new arch doc
  for review, and add a deprecated notice (with a link to the new doc) in the old architecture.
- Open a pull request with the new doc. Follow [the workflow](#workflow) below for extra guidance.

## Objectives

The primary objective for Architecture Review meetings is to validate the following:

1. Technical Feasibility
2. Scope of Effort
3. Asset Reusability
4. Delivery Quality

## Workflow

- Follow the contributing guidelines above.
- Open a pull request at least one day before the architecture review meeting. It's a PR so you can
  always add changes if you need to, but opening the PR is the way to share it with the team with
  ample time before the review session so that people don't need to digest everything during the
  meeting.
- The first 10-15 minutes of the review meeting will consist of the document author going through
  the architecture.
- The rest of the session will be focused on discussing any gaps we see in the architecture,
  debating different options, etc.
- The session should be recorded and notes should also be taken.
- After the session, the architecture owner is responsible for updating the document with the proper
  changes and pushing up the changes to their PR.
- The pull request can go through the typical process with devs submitting comments/reviews until it
  get's merged.
- We merge and get started with development 😊.

## Checklist

### General

1. Describe how the look and feel of your presentation layer compares to the look and feel of the
   other existing applications.
2. What is the deployment approach?
3. What technology (hardware and software) is needed for this system?
4. Describe the application architecture. Describe what the application generally does, the major
   components of the application and the major data flows.
5. Is the flexibility of the architecture demonstrated?
   1. How can it cope with likely changes in the requirements?
   2. Document the most relevant change scenarios.

### Software Engineering Principles

1. Areas of concern are separated.
2. Every component has a single responsibility.
3. Components do not rely on the internal details of other components.
4. Functionality is not duplicated within the architecture.
5. Components are grouped logically into layers.
6. Abstraction is used to design loose coupling between layers.

### Asset Reusability

1. What existing assets and services are being leveraged for this solution?
2. What new reusable assets are being proposed as part of this solution?

### External Integrations

1. What other applications and/or systems require integration with yours? Are there any data and
   process sharing capabilities? If so, describe what is being shared and by what
   technique/technology.
2. Describe the integration level and strategy with each.

### User Considerations

1. Who are the main stakeholders of the system.
2. How geographically distributed is the user base?
3. How will users access your applications and data?
4. What is the size of the user base and their expected performance level?
5. Describe the current user base and how that base is expected to change.
6. Who besides the original customer might have a use for or benefit from using this system?

### Testing

1. What performance and stress test techniques do you use?
2. Describe the instrumentation included in the application that allows for the health and
   performance of the application to be monitored.

<!-- prettier-ignore-start -->
<!-- start_toc -->
| Doc | Overview |
|--|--|
| [Template](/architecture/TEMPLATE.md#readme) | Templates for architecture specs |
<!-- end_toc -->
<!-- prettier-ignore-end -->