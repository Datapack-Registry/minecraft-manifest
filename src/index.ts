import * as actionsCore from '@actions/core';
import * as actionsGithub from '@actions/github';
import * as actionsArtifact from '@actions/artifact';

import { fetchManifestData } from './fetch_manifest_data.ts';
import { getArtifacts } from './get_artifacts.ts';
import { readManifestFile } from './read_manifest_file.ts';
import { writeManifestFile } from './write_manifest_file.ts';


const artifactClient = new actionsArtifact.DefaultArtifactClient();

const inputManifestURL = actionsCore.getInput('manifest-url');
const githubToken = actionsCore.getInput('token');

const repositoryOwner = actionsGithub.context.repo.owner;
const repositoryName = actionsGithub.context.repo.repo;

(async () => {
  console.log('Fetching current manifest version...');
  const currentManifest = await fetchManifestData(inputManifestURL);
  console.log('Found latest version:', currentManifest);
  console.log('Fetching current manifest version... Done!');

  actionsCore.setOutput('version-current-release', currentManifest.release);
  actionsCore.setOutput('version-current-snapshot', currentManifest.snapshot);
  
  console.log('Getting artifacts...');
  const artifacts = await getArtifacts(
    githubToken,
    repositoryOwner,
    repositoryName,
    'manifest'
  );
  console.log('Found artifacts:', artifacts);

  const previousArtifact = artifacts[0];
  console.log('Found previous artifact:', previousArtifact);
  console.log('Getting artifacts... Done!');

  if (previousArtifact) {
    console.log('Downloading previous artifact...');
    await artifactClient.downloadArtifact(
      previousArtifact.id,
      {
        findBy: {
          repositoryOwner,
          repositoryName,
          token: githubToken,
          workflowRunId: previousArtifact.workflow_run?.id ?? 0
        },
        path: './artifacts'
      }
    );
    console.log('Downloading previous artifact... Done!');

    console.log('Reading previous manifest...');
    const previousManifest = await readManifestFile('./artifacts/manifest.json');
    console.log('Reading previous manifest... Done!');

    actionsCore.setOutput('version-previous-release', previousManifest?.release);
    actionsCore.setOutput('version-previous-snapshot', previousManifest?.snapshot);
  }

  console.log('Writing new current manifest...');
  await writeManifestFile('./artifacts/manifest.json', currentManifest);
  console.log('Writing new current manifest... Done!');
  
  console.log('Uploading current artifact...');
  artifactClient.uploadArtifact(
    'manifest',
    ['./artifacts/manifest.json'],
    './artifacts'
  )
  console.log('Uploading current artifact... Done!');
})()

