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
  actionsCore.startGroup(`Fetching current manifest version from "${inputManifestURL}" ...`)
  const currentManifest = await fetchManifestData(inputManifestURL);
  const releaseVersion = currentManifest.versions.find(v => v.id == currentManifest.latest.release);
  const snapshotVersion = currentManifest.versions.find(v => v.id == currentManifest.latest.snapshot);
  actionsCore.info('Found latest version:');
  actionsCore.info(`- Release: ${currentManifest.latest.release} (url: ${releaseVersion?.url})`);
  actionsCore.info(`- Snapshot: ${currentManifest.latest.snapshot} (url: ${snapshotVersion?.url})`);
  actionsCore.endGroup();

  actionsCore.setOutput('version-current-release', currentManifest.latest.release);
  actionsCore.setOutput('version-current-release-url', releaseVersion?.url);
  actionsCore.setOutput('version-current-snapshot', currentManifest.latest.snapshot);
  actionsCore.setOutput('version-current-snapshot-url', snapshotVersion?.url);
  
  actionsCore.startGroup('Getting artifacts ...');
  actionsCore.info('Searching existing artifacts ...');

  const artifacts = await getArtifacts(
    githubToken,
    repositoryOwner,
    repositoryName,
    'manifest'
  );

  actionsCore.info(`Found ${artifacts.length} artifact${artifacts.length === 1 ? '' : 's'}.`);

  const previousArtifact = artifacts[0];

  actionsCore.info('Previous artifact:');
  actionsCore.info(`- Name: ${previousArtifact.name}`);
  actionsCore.info(`- ID: ${previousArtifact.id}`);
  actionsCore.info(`- Node ID: ${previousArtifact.node_id}`);
  actionsCore.info(`- Workflow ID: ${previousArtifact.workflow_run?.id}`);
  actionsCore.info(`- Created at: ${new Date(previousArtifact.created_at ?? '').toLocaleString()}`);
  actionsCore.info(`- Expires at: ${new Date(previousArtifact.created_at ?? '').toLocaleString()}`);
  actionsCore.info(`- Download: ${previousArtifact.archive_download_url}`);

  actionsCore.endGroup();

  if (previousArtifact) {
    actionsCore.startGroup('Downloading previous artifact ...');
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

    actionsCore.startGroup('Reading previous manifest ...');
    const previousManifest = await readManifestFile('./artifacts/manifest.json');
    actionsCore.endGroup();

    const versionRelaseChanged = previousManifest?.release !== currentManifest.latest.release;
    const versionSnapshotChanged = previousManifest?.snapshot !== currentManifest.latest.snapshot;
    const versionChanged = versionRelaseChanged || versionSnapshotChanged;
      
    actionsCore.setOutput('version-changed', versionChanged);
    actionsCore.setOutput('version-release-changed', versionRelaseChanged);
    actionsCore.setOutput('version-snapshot-changed', versionSnapshotChanged);
    actionsCore.setOutput('version-previous-release', previousManifest?.release);
    actionsCore.setOutput('version-previous-snapshot', previousManifest?.snapshot);
  }
  
  actionsCore.startGroup('Writing new current manifest ...');
  await writeManifestFile('./artifacts/manifest.json', currentManifest.latest);
  actionsCore.endGroup();
  
  actionsCore.startGroup('Uploading new current artifact ...');
  await artifactClient.uploadArtifact(
    'manifest',
    ['./artifacts/manifest.json'],
    './artifacts'
  )
  actionsCore.endGroup();
})()
