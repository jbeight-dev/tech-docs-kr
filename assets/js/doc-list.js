// 목록의 검색·필터·정렬. DOM과 분리해 scripts/check_doc_list.js에서 검증한다.
const titleCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
const byTitle = (a, b) => titleCollator.compare(a.title, b.title);
// YYYY-MM-DD는 문자열 순서가 곧 날짜 순서다. 빈 값은 내림차순에서 맨 뒤로 간다.
const byTranslatedDesc = (a, b) =>
  (b.translated_at || '').localeCompare(a.translated_at || '') || byTitle(a, b);

function visibleDocs(docs, { query = '', category = '', sort = 'translated' } = {}) {
  const q = query.trim().toLowerCase();
  return docs
    .filter((d) =>
      (!category || d.category === category) &&
      [d.title, d.description, ...(d.tags || [])].join(' ').toLowerCase().includes(q))
    .sort(sort === 'title' ? byTitle : byTranslatedDesc);
}

if (typeof module !== 'undefined') module.exports = { visibleDocs };
