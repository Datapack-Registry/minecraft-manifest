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
    console.log('Artifact found:', artifact.id, new Date(artifact.created_at ?? '').toLocaleString('de-de'));
  })
  console.log('Listing Artifacts... Done!');

  console.log('Latest Artifact found:', artifacts[0]);

  try {
    console.log('Downloading Artifact...');
    
    await actionsGithub.getOctokit(githubToken).rest.actions.downloadArtifact({
      owner: actionsGithub.context.repo.owner,
      repo: actionsGithub.context.repo.repo,
      name: 'manifest',
      archive_format: 'zip',
      artifact_id: artifacts[0].id
    }).then((response) => {
      console.log('Downloading Artifact...');
      console.log(response.data);
      console.log('Downloading Artifact... Done');
    });
    // await artifactClient.downloadArtifact(artifacts[0].id, {findBy: {
    //   repositoryOwner: actionsGithub.context.repo.owner,
    //   repositoryName: actionsGithub.context.repo.repo,
    //   token: githubToken,
    //   workflowRunId: artifacts[0].workflow_run?.id ?? 0
    // }}).then((response) => {
    //   console.log('Downloading Artifact:', response.downloadPath);
    // });

    console.log('Downloading Artifact... Done!');
  } catch (error) {
    console.log(error);
    
  }
  

  // const currentManifest = {
  //   latest: '',
  //   snapshot: ''
  // }
  
  // console.log('currentManifest:', currentManifest);
  
  // await fs.mkdir(`./data`, {recursive: true})
  // await fs.writeFile(
  //   './data/manifest.json',
  //   JSON.stringify(currentManifest)
  // )

  // artifactClient.uploadArtifact(
  //   'manifest',
  //   [`./data/manifest.json`],
  //   `./data`
  // )
})()

