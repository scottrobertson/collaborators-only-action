# Collaborators Only GitHub Action

Automatically close PR's from people outside of the repo collaborators.

## Usage

```yaml
on:
  pull_request:
    types: [opened, reopened]

jobs:
  collaborators-only:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: scottrobertson/collaborators-only-action@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          close-message: Sorry, we don't accept PR's from outside collaborators.
```
