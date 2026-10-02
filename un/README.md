# UN project directory

Navigation: `/code.html` → `/un/` → `/un/transcript-agent/`.

The hub uses the main portfolio stylesheet. The Transcript Agent retains its own
review interface and report styling. Its working source remains in
https://github.com/LystadJS/UNGA81-Transcript-Agent; the older project Pages URL
continues to work.

Refresh the nested public mirror after changing the agent's web interface or
published report assets:

```sh
python scripts/sync_un_project.py /path/to/UNGA81-Transcript-Agent
```

Review, commit and push the resulting changes in this website repository. The
sync only copies the project's public Pages build, never review-work packets,
labels, model weights or credentials. The manifest records copied file hashes.
Sync removes only previously mirrored files that are no longer in the public
build. This is an explicit sync, not an automatic cross-repository deployment.

Add future UN projects as sibling directories under `un/` and link them from
`un/index.html`.
