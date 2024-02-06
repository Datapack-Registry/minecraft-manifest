import { ManifestData } from './interface/manifest_data.ts';

export function fetchManifestData(url : string) : Promise<ManifestData> {
  return fetch(url).then(async (response) => {
    try {
      return await response.json() as Promise<ManifestData>
    } catch (error) {
      throw new Error(error)
    }
  })
}
