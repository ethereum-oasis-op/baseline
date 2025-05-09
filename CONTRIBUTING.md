# How to contribute?

__Baseline__ is an open-source project that is actively seeking contributions from any willing participants. Here are some guidelines for people that would like to contribute to the project.

## First-time contributors

If you are new to the baseline project and are looking for an entry-point to make your first contribution, look [here](https://github.com/ethereum-oasis-op/baseline/issues?q=is%3Aopen+is%3Aissue+label%3A%22%3Astar_struck%3A+good+first+issue%22). That link shows all of the tagged `good first issues`, which are meant to be small pieces of work that a first-time contributor can pick-up and complete. If you find one that you'd like to work on, please assign yourself or comment on the issue and one of the maintainers can assign it for you.

## Submitting a new issue

If you want to create a new issue that doesn't exist already, follow the guidelines in one of our [Issue Templates](https://github.com/ethereum-oasis-op/baseline/tree/main/.github/ISSUE_TEMPLATE).

## Submitting a new pull request

Follow these steps when submitting a pull request:

1. Fork this repo into your GitHub account. Read more about forking a repo on Github [here](https://help.github.com/articles/fork-a-repo/).
1. Create a new branch, based on the `main` branch, with a name that concisely describes what you’re working on (ex. `add-mysql`).
1. Ensure that your changes do not cause any existing tests to fail.
1. Submit a pull request against the `main` branch.

## Branch naming and commit messages

### Branch naming

main - main development branch, feature and release branches branched from it, changes only through the PR process.

feature/this-is-a-new-feature-branch - in case no related BLIP exists
feature/BLIP-9-repo-branch-standards - in case related BLIP exists

bugfix/name-of-the-bug

release/1.0.0 - cut from main when ready

### Rebasing note

After completed work on a feature branch, rebase main before opening a PR. After PR approved rebase again to make sure changes from latest main picked up before merging the PR.

### Commit messages format:

In the commit message, always continue the sentence "This commit does ...". Examples of good commit messages:

"Rename examples folder in the root of the repo to reference-implementations"
"Add RabbitMQ client as another messaging interface implementation"
"Bump dependency packages versions to fix potential security issues"

## Signing the eCLA/iCLA

Anyone can do a pull request and commit. In order for your work to be merged, you will need to sign the eCLA (entity contributor agreement) if you are contributing on behalf of your company, or iCLA (individual contributor agreement) if you are just contributing for yourself. [Learn more about the eCLA here.](https://www.oasis-open.org/resources/projects/cla/projects-entity-cla)

The iCLA is administered by a bot which will comment on your PR and direct you to sign the iCLA if you haven’t previously done so. This happens automatically when people submit a pull request, or they can access directly by going to [https://cla-assistant.io/ethereum-oasis-op/managed-open-project](https://cla-assistant.io/ethereum-oasis-op/managed-open-project).
