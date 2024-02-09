import * as actionsCore from '@actions/core';
import * as actionsGithub from '@actions/github';
import * as actionsArtifact from '@actions/artifact';
import * as fs from 'fs/promises';

import { fetchManifestData } from './fetch_manifest_data.ts';


const artifactClient = new actionsArtifact.DefaultArtifactClient();

const inputManifestURL = actionsCore.getInput('manifest-url');
const githubToken = actionsCore.getInput('token');

(async () => {
  const artifacts = (await actionsGithub.getOctokit(githubToken).rest.actions.listArtifactsForRepo({
    owner: actionsGithub.context.repo.owner,
    repo: actionsGithub.context.repo.repo,
    name: 'manifest'
  })).data.artifacts;
  console.log('Listing Artifacts...');
  artifacts.forEach((artifact) => {
    console.log('Artifact found:', new Date(artifact.created_at ?? '').toLocaleString('de-de'));
  })
  console.log('Listing Artifacts... Done!');

  console.log('Latest Artifact found:', artifacts[0]);

  artifactClient.downloadArtifact(artifacts[0].id, {
    path: './data/latest_manifest'
  }).then((response) => {
    console.log('Downloading Artifact:', response.downloadPath);
  });
  

  const currentManifest = {
    latest: '',
    snapshot: ''
  }
  
  console.log('currentManifest:', currentManifest);
  
  await fs.mkdir(`./data`, {recursive: true})
  await fs.writeFile(
    './data/current_manifest.json',
    JSON.stringify(currentManifest)
  )

  artifactClient.uploadArtifact(
    'manifest',
    [`./data/latest_manifest.json`],
    `./data`
  )
})()

