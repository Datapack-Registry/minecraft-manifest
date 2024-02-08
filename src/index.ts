import * as actionsCore from '@actions/core';
import * as actionsGithub from '@actions/github';
import * as actionsArtifact from '@actions/artifact';
import * as fs from 'fs/promises';

import { fetchManifestData } from './fetch_manifest_data.ts';


const artifactClient = new actionsArtifact.DefaultArtifactClient();

const inputManifestURL = actionsCore.getInput('manifest-url');
const githubToken = actionsCore.getInput('token');

(async () => {
  // download artifact from previous run and compare it to currentManifest data...
  console.log('workflow:');
  console.log(actionsGithub.context.runId, actionsGithub.context.runNumber);

  const currentManifest = (await fetchManifestData(inputManifestURL)).latest
  
  console.log('latestManifest:', currentManifest);
  
  fs.mkdir(`./data`, {recursive: true})
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

