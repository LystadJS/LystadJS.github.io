"""Refresh only the public Transcript Agent mirror from an explicit local checkout."""
import argparse,hashlib,json,subprocess,tempfile,shutil
from pathlib import Path

def sync(source):
    source=Path(source).resolve();site=Path(__file__).resolve().parents[1]
    import importlib.util
    spec=importlib.util.spec_from_file_location('un_pages',source/'tools/build_pages.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    target=site/'un/transcript-agent';target.mkdir(parents=True,exist_ok=True)
    manifest_path=target/'mirror-manifest.json';previous=json.loads(manifest_path.read_text())['files'] if manifest_path.exists() else {}
    with tempfile.TemporaryDirectory() as t:
        built=Path(t)/'site';module.build(built)
        files={p.relative_to(built).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in built.rglob('*') if p.is_file()}
        for rel in previous:
            p=(target/rel).resolve();p.relative_to(target.resolve())
            if rel not in files and p.is_file():p.unlink()
        for rel in files:
            p=target/rel;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(built/rel,p)
    manifest_path.write_text(json.dumps({'source_repository':'https://github.com/LystadJS/UNGA81-Transcript-Agent','files':files},indent=2)+'\n')
    print(json.dumps({'destination':'un/transcript-agent','public_files':len(files)}))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('source_checkout');a=p.parse_args();sync(a.source_checkout)
