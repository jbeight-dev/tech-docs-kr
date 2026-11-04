#!/usr/bin/env node
// 목록의 검색·필터·정렬 점검. 실행: node scripts/check_doc_list.js
const assert = require('node:assert');
const { visibleDocs } = require('../assets/js/doc-list.js');

const docs = [
  { title: 'Zeta', description: '설명', category: 'A', translated_at: '2026-01-01', tags: ['mcp'] },
  { title: '가나', description: 'Search me', category: 'B', translated_at: '2026-02-01' },
  { title: 'alpha', description: '설명', category: 'A', translated_at: '2026-01-01' },
  { title: '날짜 없음', description: '설명', category: 'B' },
];
const titles = (options) => visibleDocs(docs, options).map((d) => d.title);

assert.deepStrictEqual(titles(), ['가나', 'alpha', 'Zeta', '날짜 없음'], '번역일 내림차순, 동률은 제목, 날짜 없음은 맨 뒤');
assert.deepStrictEqual(titles({ sort: 'title' }), ['가나', '날짜 없음', 'alpha', 'Zeta'], '제목순은 한글 먼저, 영문은 대소문자 무시');
assert.deepStrictEqual(titles({ query: ' MCP ' }), ['Zeta'], '태그 검색, 공백·대소문자 무시');
assert.deepStrictEqual(titles({ query: 'search' }), ['가나'], '설명 검색');
assert.deepStrictEqual(titles({ category: 'B', sort: 'title' }), ['가나', '날짜 없음'], '필터와 정렬 조합');
assert.deepStrictEqual(titles({ query: '설명', category: 'A', sort: 'title' }), ['alpha', 'Zeta'], '검색·필터·정렬 조합');
assert.deepStrictEqual(titles({ query: '없는 검색어' }), [], '결과 없음');
assert.strictEqual(docs[0].title, 'Zeta', '원본 배열은 바뀌지 않음');
console.log('OK: 목록 로직');
