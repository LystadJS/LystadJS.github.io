"""Ensure the shared integrity check includes nested UN application assets."""
import contextlib
import importlib.util
import io
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("site_integrity", Path(__file__).with_name("site-integrity.py"))
integrity = importlib.util.module_from_spec(spec)
spec.loader.exec_module(integrity)


class SiteIntegrity(unittest.TestCase):
    def test_nested_un_documents_and_fragment_destinations_are_checked(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            page = root / "un/transcript-agent/nested/index.html"
            page.parent.mkdir(parents=True)
            page.write_text('<a href="../target.html#missing">Target</a>', encoding="utf-8")
            (page.parent.parent / "target.html").write_text('<h1 id="present">Target</h1>', encoding="utf-8")
            output = io.StringIO()
            with contextlib.redirect_stdout(output), self.assertRaises(SystemExit):
                integrity.run(root)
            self.assertIn("missing anchor ../target.html#missing", output.getvalue())
            page.write_text('<a href="../target.html#present">Target</a>', encoding="utf-8")
            self.assertEqual(integrity.run(root)["pages"], 2)

    def test_nested_un_javascript_is_syntax_checked(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            script = root / "un/transcript-agent/nested/worker.js"
            script.parent.mkdir(parents=True)
            script.write_text('const invalid = ;', encoding="utf-8")
            output = io.StringIO()
            with contextlib.redirect_stdout(output), self.assertRaises(SystemExit):
                integrity.run(root)
            self.assertIn("SyntaxError", output.getvalue())
            script.write_text('const valid = 1;', encoding="utf-8")
            self.assertEqual(integrity.run(root)["javascript_files_parsed"], 1)
