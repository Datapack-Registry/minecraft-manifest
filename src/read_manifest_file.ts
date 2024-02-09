import * as fs from 'fs/promises';
import { Latest } from './interface/latest.ts';

export function readManifestFile(path : string) : Promise<Latest | undefined> {
  return fs.readFile(path, {encoding: 'utf-8'}).then((data) => {
    return JSON.parse(data) as Latest
  }).catch((reason) => {
    console.log('Error while executing "readFile":', reason);
    return undefined
  });
}
