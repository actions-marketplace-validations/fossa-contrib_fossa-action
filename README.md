# Fossa Action

[![Main workflow](https://github.com/fossa-contrib/fossa-action/workflows/Main%20workflow/badge.svg?branch=master)](https://github.com/fossa-contrib/fossa-action/actions)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B7767%2Fgithub.com%2Ffossa-contrib%2Ffossa-action.svg?type=small)](https://app.fossa.com/projects/custom%2B7767%2Fgithub.com%2Ffossa-contrib%2Ffossa-action?ref=badge_small)

## Synopsis

The action sets up the latest release of `fossa-cli`, infer the correct
configuration from the current system state, analyze the project for a list of
its dependencies, and upload the results to FOSSA.

## Roadmap

This action aims to provide an OS-neutral interface to `fossa-cli`, and so will
not add features that only work on one operating system. It will also track the
latest release of `fossa-cli`.

## Usage

### How to specify the version

There is a point that is particularly easy to misunderstand. It's where you
specify the version of the action _itself_.

```yml
- name: Run and upload build analysis
  uses: fossa-contrib/fossa-action@v1
  #                               ^^^
  with:
    fossa-api-key: ${{ secrets.FOSSA_API_KEY }}
    github-token: ${{ github.token }}
```

We recommend that you include the version of the action. We adhere to
[semantic versioning](https://semver.org), it's safe to use the major version
(`v1`) in your workflow. If you use the master branch, this could break your
workflow when we publish a breaking update and increase the major version.

```yml
steps:
  # Reference the major version of a release (most recommended)
  - uses: fossa-contrib/fossa-action@v1
  # Reference a specific commit (most strict)
  - uses: fossa-contrib/fossa-action@4fb2464
  # Reference a semver version of a release (not recommended)
  - uses: fossa-contrib/fossa-action@v1.0.2
  # Reference a branch (most dangerous)
  - uses: fossa-contrib/fossa-action@master
```

### Example workflow

```yml
name: License Scanning

on:
  - pull_request
  - push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Run and upload build analysis
        uses: fossa-contrib/fossa-action@v1
        with:
          fossa-api-key: ${{ secrets.FOSSA_API_KEY }}
          github-token: ${{ github.token }}
```

## Inputs

- `fossa-api-key`: This input is used to upload the results of the build
  analysis.
- `github-token`: This input is used to get the latest release of `fossa-cli`
  from GitHub API.
