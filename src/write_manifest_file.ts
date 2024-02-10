import * as fs from 'fs/promises';
import { dirname } from 'path';
import { Latest } from './interface/latest.ts';

export async function writeManifestFile(path : string, data : Latest) : Promise<void> {
  await fs.mkdir(dirname(path), {recursive: true}).catch((reason) => {
    console.log('Error while executing "mkdir":', reason);
  });
  await fs.writeFile(
    path,
    JSON.stringify(data)
  ).catch((reason) => {
    console.log('Error while executing "writeFile":', reason);
  });
}
