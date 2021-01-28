const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const octokit = github.getOctokit(token)

async function run() {
  const owner = github.context.payload.repository.owner.login
  const repo = github.context.payload.repository.name
  const pull_number = github.context.payload.pull_request.number
  const username = github.context.payload.pull_request.user.login

  const isCollaborator = await octokit.repos.checkCollaborator({
    owner,
    repo,
    username,
  }).catch((error) => {
    console.log(`Checking collaborator failed: ${error.message}`)
    core.setFailed(error.message)
    exit(1)
  });

  // If they are not a collaborator, close the PR.
  if (!isCollaborator) {
    await octokit.pulls.update({
      owner,
      repo,
      pull_number,
      state: 'closed'
    }).catch((error) => {
      console.log(`Closing PR failed: ${error.message}`)
      core.setFailed(error.message)
      exit(1)
    })

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: core.getInput('close-message'),
    }).catch((error) => {
      console.log(`Creating comment failed: ${error.message}`)
      core.setFailed(error.message)
      exit(1)
    });

    await octokit.issues.lock({
      owner,
      repo,
      issue_number: pull_number,
    });
  }
}

run();
