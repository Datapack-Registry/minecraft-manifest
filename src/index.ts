import * as actionsCore from '@actions/core';
import * as actionsArtifact from '@actions/artifact';

const artifact = new actionsArtifact.DefaultArtifactClient();

// import { fetchManifestData } from './fetch_manifest_data.ts';

// const inputManifestURL = actionsCore.getInput('manifest-url');

(async () => {
  // console.log((await fetchManifestData(inputManifestURL)).latest);
  
  const artifacts = await artifact.listArtifacts({latest: true})
  artifacts.artifacts.forEach(({createdAt, id, name, size}) => {
    console.log(createdAt, id, name, size);
  })
})()

