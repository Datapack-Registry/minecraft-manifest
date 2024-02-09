import { Latest } from './interface/latest.ts';
import { ManifestData } from './interface/manifest_data.ts';

export function fetchManifestData(url : string) : Promise<Latest> {
  return fetch(url).then(async (response) => {
    try {
      return (await (await response.json() as Promise<ManifestData>)).latest;
    } catch (error) {
      throw new Error(error)
    }
  })
}
