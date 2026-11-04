# Tech Docs KR

해외 기술 문서의 한국어 번역 아카이브. Claude Skill(`translate-tech-doc`)이 만든 독립형 HTML을 GitHub Pages로 그대로 게시한다.

## 신규 문서 게시

1. `translate-tech-doc` 스킬로 `<원본이름>_ko.html`을 생성한다.
2. 번역 정확성, 이미지, 원문 라이선스의 번역·재배포 허용 여부를 검수한다.
3. 카테고리 폴더(`datahub/`, `mcp/` 등)에 HTML을 넣는다. 원문 `LICENSE`, `NOTICE`가 있으면 해당 폴더에 함께 둔다.
4. 원문 저장소를 가리키는 상대 링크(`*.md` 등)는 번역본이 있으면 해당 `_ko.html` 상대경로로, 없으면 원문 절대 URL로 바꾼다. `.doc-meta`의 원본 항목에는 원문 링크를 건다.
5. `docs.json`에 항목을 추가한다. 카테고리 필터는 이 값에서 자동으로 만들어진다.
6. 점검 후 커밋·푸시한다.

```sh
python3 scripts/check_docs.py          # 메타데이터, 파일 경로, 깨진 상대 링크, 미등록 HTML 점검
node scripts/check_doc_list.js         # 목록 검색·필터·정렬 로직 점검
python3 -m http.server 8000            # http://localhost:8000 에서 미리보기 (file://로는 목록이 뜨지 않음)
```

### `docs.json` 필드

| 필드 | 필수 | 내용 |
| --- | --- | --- |
| `id` | O | 고유 식별자 (`<카테고리>-<문서>`) |
| `title`, `category`, `description` | O | 목록에 표시할 제목, 카테고리, 설명 |
| `path` | O | 저장소 루트 기준 상대경로 (`/`로 시작하지 않음) |
| `translated_at` | O | 번역일 (`YYYY-MM-DD`) |
| `source_url`, `license` | O | 원문 URL, 원문 라이선스. 확인한 값만 적고 추측하지 않는다 |
| `written_at` | | 번역본이 아닌 자체 작성 문서의 작성일. 있으면 `translated_at`, `source_url`, `license`를 생략할 수 있고, 최근 번역순에서는 뒤에 놓인다 |
| `source_version` | | 원문 버전 또는 커밋 |
| `tags` | | 검색용 태그 배열 |

## GitHub Pages 설정

1. 공개 저장소 `tech-docs-kr`을 만들어 푸시한다.
2. Settings → Pages → Source를 "Deploy from a branch", 기본 브랜치 `/ (root)`로 지정한다.
3. `https://<username>.github.io/tech-docs-kr/`에서 목록과 문서가 열리는지 확인한다.

프로젝트 사이트는 하위 경로로 서비스되므로 사이트 안의 경로는 항상 상대경로로 쓴다.

## 저작권

번역문의 저작권과 라이선스는 각 원문을 따른다. DataHub 문서는 Apache License 2.0이며 라이선스와 고지문은 [`datahub/LICENSE`](datahub/LICENSE), [`datahub/NOTICE`](datahub/NOTICE)에 있다. `vercel-labs/skills`의 문서는 MIT License이며 고지문은 [`skills/LICENSE`](skills/LICENSE)에 있다. 번역본은 원문을 한국어로 옮기고 링크를 조정한 수정본이다.
