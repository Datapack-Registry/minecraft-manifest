# Minecraft Manifest
A GitHub action to get infos about the minecraft manifest version.

This action fetches the latest release and snapshot version from the [piston-meta.mojang.com API](https://piston-meta.mojang.com/mc/game/version_manifest_v2.json) and compares that with a version, stored in an artifact, from a previous workflow run.

A big advantage of this action compared to other actions is that no additional files are needed within the repository to cache the latest version. All necessary information is stored in artifacts.
