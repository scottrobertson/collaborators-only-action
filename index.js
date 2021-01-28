const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const octokit = github.getOctokit(token)

async function run() {
  const owner = github.context.payload.repository.owner.login
  const repo = github.context.payload.repository.name
  const pull_number = github.context.payload.pull_request.id
  const username = github.context.payload.pull_request.user.login

  const isCollaborator = await octokit.repos.checkCollaborator({
    owner,
    repo,
    username,
  });

  // If they are not a collaborator, close the PR.
  if (isCollaborator) {
    await octokit.pulls.update({
      owner,
      repo,
      pull_number,
      state: 'closed'
    });

    await octokit.issues.createComment({
      owner,
      repo,
      pull_number,
      body: 'Pull Request rejected, we only accept pull requests from approved collaborators',
    });
  }
}

run();
