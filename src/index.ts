import * as actionsCore from '@actions/core';
import { fetchManifestData } from './fetch_manifest_data.ts';

const inputManifestURL = actionsCore.getInput('manifest-url');

(async () => {
  console.log((await fetchManifestData(inputManifestURL)).latest);
})()

