import * as actionsCore from '@actions/core';
import * as cationsGithub from '@actions/github';
import * as actionsArtifact from '@actions/artifact';
import * as actionsToolCach from '@actions/tool-cache';
import * as fs from 'fs/promises';

import { fetchManifestData } from './fetch_manifest_data.ts';


const artifactClient = new actionsArtifact.DefaultArtifactClient();

const inputManifestURL = actionsCore.getInput('manifest-url');

(async () => {
  const previousManifest = JSON.parse(await fs.readFile(actionsToolCach.find('latestManifest', '0.1.0'), {encoding: 'utf-8'}) || '{}');

  console.log('previousManifest:', previousManifest);

  const latestManifest = (await fetchManifestData(inputManifestURL)).latest
  
  console.log('latestManifest:', latestManifest);
  
  
  fs.mkdir(`./data`, {recursive: true})
  await fs.writeFile(
    './data/latest_manifest.json',
    JSON.stringify(latestManifest)
  )
  
  actionsToolCach.cacheFile(
    './data/latest_manifest.json',
    'latest_manifest.json',
    'latestManifest',
    '0.1.0'
  )

  // artifactClient.uploadArtifact(
  //   'manifest',
  //   [`./data/latest_manifest.json`],
  //   `./data`
  // )
  
  // const artifacts = await artifactClient.listArtifacts({latest: true})
  // artifacts.artifacts.forEach(({createdAt, id, name, size}) => {
  //   console.log(createdAt, id, name, size);
  // })
})()

