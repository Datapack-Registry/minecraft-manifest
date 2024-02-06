import { VersionEntry } from './version_entry.ts';

export interface ManifestData {
  latest : {
    release : string,
    snapshot : string
  },
  versions : VersionEntry[]
}
