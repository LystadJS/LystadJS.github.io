"""Small engineering fixtures; never reads or modifies a real project checkout."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("sync_un_project", Path(__file__).resolve().parents[1] / "scripts/sync_un_project.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PublicSyncTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.source = self.root / "source"
        self.site = self.root / "site"
        (self.source / "tools").mkdir(parents=True)
        self.builder = self.source / "tools/build_pages.py"
        self.builder.write_text('''from pathlib import Path
def build(output):
    output = Path(output); output.mkdir(parents=True)
    (output / "index.html").write_text("fixture")
''')

    def test_identical_files_are_not_rewritten(self):
        first = module.sync(self.source, site=self.site)
        target = self.site / "un/transcript-agent/index.html"
        timestamp = target.stat().st_mtime_ns
        second = module.sync(self.source, site=self.site)
        self.assertEqual(first["copied"], 1)
        self.assertEqual(second["copied"], 0)
        self.assertEqual(second["unchanged"], 1)
        self.assertEqual(target.stat().st_mtime_ns, timestamp)

    def test_only_previously_mirrored_files_are_removed(self):
        module.sync(self.source, site=self.site)
        target = self.site / "un/transcript-agent"
        (target / "local.txt").write_text("keep")
        manifest = json.loads((target / "mirror-manifest.json").read_text())
        manifest["files"]["old.txt"] = "old"
        (target / "old.txt").write_text("remove")
        (target / "mirror-manifest.json").write_text(json.dumps(manifest))
        result = module.sync(self.source, site=self.site)
        self.assertEqual(result["removed"], 1)
        self.assertTrue((target / "local.txt").exists())

    def test_traversal_is_rejected_before_changes(self):
        module.sync(self.source, site=self.site)
        target = self.site / "un/transcript-agent"
        manifest_path = target / "mirror-manifest.json"
        manifest_path.write_text(json.dumps({"files": {"../unsafe": "hash"}}))
        before = (target / "index.html").read_bytes()
        with self.assertRaises(ValueError):
            module.sync(self.source, site=self.site)
        self.assertEqual((target / "index.html").read_bytes(), before)

    def test_symlink_is_rejected(self):
        self.site.mkdir()
        (self.site / "un").mkdir()
        (self.site / "un/transcript-agent").symlink_to(self.source, target_is_directory=True)
        with self.assertRaises(ValueError):
            module.sync(self.source, site=self.site)


if __name__ == "__main__":
    unittest.main()
