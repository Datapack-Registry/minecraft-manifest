import { Latest } from './latest.ts';
import { VersionEntry } from './version_entry.ts';

export interface ManifestData {
  latest : Latest
  versions : VersionEntry[]
}
