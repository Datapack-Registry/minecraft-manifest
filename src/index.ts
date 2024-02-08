import * as actionsCore from '@actions/core';
import * as actionsGithub from '@actions/github';
import * as actionsArtifact from '@actions/artifact';
import * as fs from 'fs/promises';

import { fetchManifestData } from './fetch_manifest_data.ts';


const artifactClient = new actionsArtifact.DefaultArtifactClient();

const inputManifestURL = actionsCore.getInput('manifest-url');
const githubToken = actionsCore.getInput('token');

(async () => {
  console.log('Listing Artifacts...');
  (await artifactClient.listArtifacts()).artifacts.forEach((artifact) => {
    console.log('Artifact found:', artifact.createdAt, artifact.name, artifact.id, artifact.size);
  })
  console.log('Listing Artifacts... Done!');
  
  console.log('Listing Workflows...');
  (await actionsGithub.getOctokit(githubToken).rest.actions.listRepoWorkflows({owner: actionsGithub.context.repo.owner, repo: actionsGithub.context.repo.repo})).data.workflows.forEach((workflow) => {
    console.log('Workflow found:', workflow);
  })
  console.log('Listing Workflows... Done!');
  
  

  const currentManifest = {
    latest: '',
    snapshot: ''
  }
  
  console.log('currentManifest:', currentManifest);
  
  await fs.mkdir(`./data`, {recursive: true})
  await fs.writeFile(
    './data/latest_manifest.json',
    JSON.stringify(currentManifest)
  )

  artifactClient.uploadArtifact(
    'manifest',
    [`./data/latest_manifest.json`],
    `./data`
  )
})()

