#!/usr/bin/env python3
"""게시 전 점검: docs.json 메타데이터, 파일 경로, 문서 내부 상대 링크. 문제가 있으면 exit 1."""
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent.parent).resolve()
REQUIRED = ("id", "title", "category", "description", "path", "translated_at", "source_url", "license")


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        self.refs += [v for k, v in attrs if k in ("href", "src") and v]


def broken_refs(page):
    parser = Refs()
    parser.feed(page.read_text(encoding="utf-8"))
    for ref in parser.refs:
        url = urlsplit(ref)
        # 외부 URL·같은 문서 앵커는 제외
        if url.scheme or url.netloc or not url.path:
            continue
        if not (page.parent / unquote(url.path)).exists():
            yield ref


def check():
    errors = []
    docs = json.loads((ROOT / "docs.json").read_text(encoding="utf-8"))
    seen, registered = set(), set()
    for doc in docs:
        label = doc.get("id") or doc.get("path") or "(id 없음)"
        errors += [f"{label}: {key} 값이 비어 있음" for key in REQUIRED if not doc.get(key)]
        if doc.get("id") in seen:
            errors.append(f"{label}: id 중복")
        seen.add(doc.get("id"))
        if doc.get("source_url") and not doc["source_url"].startswith("https://"):
            errors.append(f"{label}: source_url은 https여야 함")
        if not doc.get("path"):
            continue
        page = (ROOT / doc["path"]).resolve()
        if not page.is_relative_to(ROOT) or not page.is_file():
            errors.append(f"{label}: 파일 없음 {doc['path']}")
            continue
        registered.add(page)
        errors += [f"{label}: 깨진 상대 링크 {ref}" for ref in broken_refs(page)]
    errors += [f"docs.json 미등록: {p.relative_to(ROOT)}" for p in ROOT.rglob("*_ko.html") if p not in registered]
    return errors, len(docs)


if __name__ == "__main__":
    errors, count = check()
    print("\n".join(errors) if errors else f"OK: 문서 {count}개")
    sys.exit(1 if errors else 0)
