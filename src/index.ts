import * as actionsCore from '@actions/core';
import * as actionsArtifact from '@actions/artifact';
import * as fs from 'fs';

const artifactClient = new actionsArtifact.DefaultArtifactClient();

import { fetchManifestData } from './fetch_manifest_data.ts';

const inputManifestURL = actionsCore.getInput('manifest-url');

(async () => {
  const latestManifest = (await fetchManifestData(inputManifestURL)).latest
  fs.writeFileSync(
    './data/latest_manifest.json',
    JSON.stringify(latestManifest)
  )
  artifactClient.uploadArtifact(
    'latest_manifest.json',
    ['./data/latest_manifest.json'],
    './data/latest_manifest.json'
  )
  
  // const artifacts = await artifactClient.listArtifacts({latest: true})
  // artifacts.artifacts.forEach(({createdAt, id, name, size}) => {
  //   console.log(createdAt, id, name, size);
  // })
})()

