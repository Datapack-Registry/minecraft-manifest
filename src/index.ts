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
  actionsCore.startGroup('Fetching current manifest version...')
  const currentManifest = await fetchManifestData(inputManifestURL);
  actionsCore.info(`Found latest version:`);
  actionsCore.info(`- Release: ${currentManifest.release}`);
  actionsCore.info(`- Snapshot: ${currentManifest.snapshot}`);
  actionsCore.endGroup();

  actionsCore.setOutput('version-current-release', currentManifest.release);
  actionsCore.setOutput('version-current-snapshot', currentManifest.snapshot);
  
  actionsCore.startGroup('Getting artifacts...');
  const artifacts = await getArtifacts(
    githubToken,
    repositoryOwner,
    repositoryName,
    'manifest'
  );

  actionsCore.endGroup();
  console.log('Found artifacts:', artifacts);

  const previousArtifact = artifacts[0];
  console.log('Found previous artifact:', previousArtifact);
  actionsCore.endGroup();

  if (previousArtifact) {
    actionsCore.startGroup('Downloading previous artifact...');
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
    actionsCore.endGroup();

    actionsCore.startGroup('Reading previous manifest...');
    const previousManifest = await readManifestFile('./artifacts/manifest.json');
    actionsCore.endGroup();

    actionsCore.setOutput('version-previous-release', previousManifest?.release);
    actionsCore.setOutput('version-previous-snapshot', previousManifest?.snapshot);
  }
  
  actionsCore.startGroup('Writing new current manifest...');
  await writeManifestFile('./artifacts/manifest.json', currentManifest);
  actionsCore.endGroup();
  
  actionsCore.startGroup('Uploading new current artifact...');
  await artifactClient.uploadArtifact(
    'manifest',
    ['./artifacts/manifest.json'],
    './artifacts'
  )
  actionsCore.endGroup();
})()

