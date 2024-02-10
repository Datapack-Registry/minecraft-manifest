# Minecraft Manifest
A GitHub action to get infos about the minecraft manifest version.

This action fetches the latest release and snapshot version from the [piston-meta.mojang.com API](https://piston-meta.mojang.com/mc/game/version_manifest_v2.json) and compares that with a version, stored in an artifact, from a previous workflow run.

A big advantage of this action compared to other actions is that no additional files are needed within the repository to cache the latest version. All necessary information is stored in artifacts.

## Usage
```yml
...

permissions:
  contents: write
  actions: read
  checks: write

jobs:
  minecraft-manifest:
    name: 'Minecraft Manifest'
    runs-on: ubuntu-latest      

    steps:
      - name: 'Setup repository (${{github.event.repository.name}})'
        uses: actions/checkout@v4
      
      - name: 'Test for version change'
        id: 'version-change'
        uses: Datapack-Registry/minecraft-manifest@main
        with:
          token: ${{secrets.GITHUB_TOKEN}} // <- Important!
      
      - name: 'Print output'
        run: |
          echo "Changed: ${{steps.test-action.outputs.version-changed}}"
          echo "Release changed: ${{steps.test-action.outputs.version-release-changed}}"
          echo "Snapshot changed: ${{steps.test-action.outputs.version-snapshot-changed}}"
          echo "Previous release version: ${{steps.test-action.outputs.version-previous-release}}"
          echo "Previous snapshot version: ${{steps.test-action.outputs.version-previous-snapshot}}"
          echo "Current release version: ${{steps.test-action.outputs.version-current-release}}"
          echo "Current snapshot version: ${{steps.test-action.outputs.version-current-snapshot}}"


```
