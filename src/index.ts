import * as actionsCore from '@actions/core';
import * as actionsGithub from '@actions/github';
import * as actionsArtifact from '@actions/artifact';
import * as fs from 'fs/promises';

const artifactClient = new actionsArtifact.DefaultArtifactClient();

import { fetchManifestData } from './fetch_manifest_data.ts';

const inputManifestURL = actionsCore.getInput('manifest-url');
const githubToken = actionsCore.getInput('token');

(async () => {
  const latestManifest = (await fetchManifestData(inputManifestURL)).latest

  console.log('Fetching:', latestManifest);
  console.log('Token length:', githubToken.length);

  try {
    

    const artifacts = await artifactClient.listArtifacts({findBy: {
      repositoryName: actionsGithub.context.repo.repo,
      repositoryOwner: actionsGithub.context.repo.owner,
      token: githubToken,
      workflowRunId: 1
    }})
    console.log('Artifact found:');
    
    artifacts.artifacts.forEach(({createdAt, id, name, size}) => {
      console.log(createdAt, id, name, size);
    })
  } catch (error) {
    console.log(error);
  }
  

  await fs.mkdir(`./data`, {recursive: true})
  await fs.writeFile(
    `./data/latest_manifest.json`,
    JSON.stringify(latestManifest)
  )
  
  try {
    await artifactClient.uploadArtifact(
      'latest-manifest',
      [`./data/latest_manifest.json`],
      `./data`
    )
  } catch (error) {
    console.log(error);
  }

  
  
})()

