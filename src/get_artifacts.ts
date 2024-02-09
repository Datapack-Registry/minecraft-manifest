// deno-lint-ignore-file explicit-module-boundary-types explicit-function-return-type
import {getOctokit} from '@actions/github';

export function getArtifacts(
    token : string,
    owner : string,
    repo : string,
    name : string
) {
  return getOctokit(token).rest.actions.listArtifactsForRepo({
    owner,
    repo,
    name,
  }).then((response) => response.data.artifacts);
}
