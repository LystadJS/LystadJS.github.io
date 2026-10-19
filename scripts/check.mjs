import { runPython } from './python.mjs';

const integrity = runPython(['tests/site-integrity.py']);
process.exitCode = integrity || runPython(['-m', 'unittest', 'discover', '-s', 'tests', '-p', 'test_*.py']);
