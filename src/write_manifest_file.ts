import * as actionsCore from '@actions/core';
import * as fs from 'fs/promises';
import { dirname } from 'path';
import { Latest } from './interface/latest.ts';

export async function writeManifestFile(path : string, data : Latest) : Promise<void> {
  await fs.mkdir(dirname(path), {recursive: true}).catch((reason) => {
    actionsCore.info('Error while executing "mkdir":');
    actionsCore.error(reason);
  });
  await fs.writeFile(
    path,
    JSON.stringify(data)
  ).catch((reason) => {
    actionsCore.info('Error while executing "writeFile":');
    actionsCore.error(reason);
  });
}
