import * as actionsCore from '@actions/core';
import * as github from '@actions/github';
import * as actionsArtifact from '@actions/artifact';
import * as fs from 'fs/promises';

const artifactClient = new actionsArtifact.DefaultArtifactClient();

import { fetchManifestData } from './fetch_manifest_data.ts';

const inputManifestURL = actionsCore.getInput('manifest-url');

(async () => {
  const latestManifest = (await fetchManifestData(inputManifestURL)).latest
  fs.mkdir(`${github.context.repo}/data`, {recursive: true})
  
  await fs.writeFile(
    `${github.context.repo}/data/latest_manifest.json`,
    JSON.stringify(latestManifest)
  )

  artifactClient.uploadArtifact(
    'latest-manifest',
    [`${github.context.repo}/data/latest_manifest.json`],
    `${github.context.repo}/data`
  )
  
  // const artifacts = await artifactClient.listArtifacts({latest: true})
  // artifacts.artifacts.forEach(({createdAt, id, name, size}) => {
  //   console.log(createdAt, id, name, size);
  // })
})()

